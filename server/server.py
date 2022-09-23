#!/usr/bin/env python3

"""
 Video streaming based on this excellent article
 https://blog.miguelgrinberg.com/post/flask-video-streaming-revisited
"""
import os
import time
import threading
import json
import logging
import random


from flask import Flask, Response, send_from_directory, send_file, abort
from flask_cors import CORS

import cv2

import constants
import web_utils
from base_camera import BaseCamera
from camera_opencv import OpenCvCamera
from leds import Leds, MODE_HEARTBEAT, MODE_OFF, MODE_ON

PROJECT_PATH = "/home/pi/mi_corazon"
PICTURES_PATH = "/home/pi/Pictures"
VIDEOS_PATH = "/home/pi/Videos"
WEBAPP_ROOT = f"{PROJECT_PATH}/webapp/build"

app = Flask(__name__, static_folder=WEBAPP_ROOT)
CORS(app, supports_credentials=True)

camera = OpenCvCamera()
#  this wasn't working when starting up from rc.local when it was
# instantiating Leds too soon I think.  See ensureLeds below
leds = None


def gen_rgb_video(camera):
    # Video streaming generator function
    while True:
        frame = camera.get_frame()

        jpeg = cv2.imencode('.jpg', frame)[1].tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + jpeg + b'\r\n')


@app.route('/video_feed')
def video_feed():
    # Video streaming route. Put this in the src attribute of an img tag.
    return Response(gen_rgb_video(camera),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/picture')
def picture():
    # get a random picture of Betsy and Josh
    files = os.listdir(PICTURES_PATH)
    file = random.choice(files)
    return send_file(f"{PICTURES_PATH}/{file}", mimetype="image/jpeg")


@app.route('/record_video')
def record_video():
    OpenCvCamera.record_video()
    return web_utils.respond_ok(app)


@app.route('/is_new_video_ready')
def is_new_video_ready():
    # todo make this work from actual finish recording
    leds.setMode(MODE_OFF)

    return web_utils.respond_ok(app, OpenCvCamera.is_new_video_ready)


@app.route('/save_new_video')
def save_new_video():
    os.rename(constants.LAST_AV_FILE,
              f"{constants.SAVED_VIDEOS_DIR}/{int(time.time() * 1000)}.mp4")
    return web_utils.respond_ok(app)


@app.route('/new_video')
def new_video():
    return send_file(f"{PROJECT_PATH}/{constants.LAST_AV_FILE}")


dir_path = os.path.dirname(os.path.realpath(__file__))


@app.route('/stats')
def send_stats():
    (cpu_temp, *rest) = [
        int(i) / 1000 for i in
        os.popen(
            'cat /sys/devices/virtual/thermal/thermal_zone*/temp').read().split()
    ]
    return web_utils.json_response(app, {
        "capture": BaseCamera.stats(),
        "cpu_temp": cpu_temp,
    })


@app.route('/ping')
def ping():
    return web_utils.respond_ok(app, 'pong')


# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html', cache_timeout=0)

# lighting


def ensure_leds():
    global leds
    if leds == None:
        leds = Leds()


@app.route('/bright_white')
def bright_white():
    ensure_leds()
    leds.bright_white()
    leds.setMode(MODE_ON)
    return web_utils.respond_ok(app)


@app.route('/start_heartbeat')
def start_heartbeat():
    ensure_leds()
    leds.red()
    leds.setMode(MODE_HEARTBEAT)
    return web_utils.respond_ok(app)


@app.route('/lights_off')
def lights_off():
    ensure_leds()
    leds.setMode(MODE_OFF)
    return web_utils.respond_ok(app)


class webapp:
    def __init__(self):
        self.camera = camera

    def thread(self):
        app.run(host='0.0.0.0', port=80, threaded=True)

    def start_thread(self):
        thread = threading.Thread(target=self.thread)
        # 'True' means it is a front thread,it would close when the mainloop() closes
        thread.setDaemon(False)
        thread.start()  # Thread starts


def start_app():
    # setup_logging('ai.log')
    logger = logging.getLogger(__name__)
    logger.info('server started')

    flask_app = webapp()
    flask_app.start_thread()


if __name__ == "__main__":
    start_app()
