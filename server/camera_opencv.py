"""
 This was originally pilfered from
 https://github.com/adeept/Adeept_RaspTank/blob/a6c45e8cc7df620ad8977845eda2b839647d5a83/server/camera_opencv.py

 Which looks like it was in turn pilfered from
 https://blog.miguelgrinberg.com/post/flask-video-streaming-revisited

"Great artists steal". Thank you, @adeept and @miguelgrinberg!
"""

import os
import cv2
import logging
import time
import threading
import pyaudio
import wave


import constants
from base_camera import BaseCamera

logger = logging.getLogger(__name__)

FRAME_SIZE = (1280, 720)
CAPTURE_FPS = 30

RAW_RECORDING_FILE = "data/raw.mp4"
RECORDING_DURATION = 20

AUDIO_CHUNK = 1024  # Record in chunks of 1024 samples
AUDIO_SAMPLE_FORMAT = pyaudio.paInt16  # 16 bits per sample
AUDIO_CHANNELS = 2
# AUDIO_RATE = 44100  # Record at 44100 samples per second
# for some reason, root has a lower sample rate?
AUDIO_RATE = 32000  # Record at 44100 samples per second
AUDIO_CHUNK_SECONDS = 20
AUDIO_FILENAME = "data/raw.wav"


class OpenCvCamera(BaseCamera):
    video_source = 0
    img_is_none_messaged = False
    captured_frames = []
    recording_started_at = None
    audio_thread = None
    is_new_video_ready = False

    def __init__(self):
        OpenCvCamera.set_video_source(constants.CAMERA_CHANNEL_PICAM)
        super(OpenCvCamera, self).__init__()

    @classmethod
    def record_video(cls):
        if OpenCvCamera.recording_started_at != None:
            return

        OpenCvCamera.is_new_video_ready = False
        OpenCvCamera.audio_thread = threading.Thread(target=cls._audio_thread)
        OpenCvCamera.audio_thread.start()

        print(f"recording {RECORDING_DURATION} second video")
        OpenCvCamera.recording_started_at = time.time()

    @classmethod
    def _audio_thread(cls):
        p = pyaudio.PyAudio()  # Create an interface to PortAudio

        print('Recording 20 seconds of audio')

        stream = p.open(format=AUDIO_SAMPLE_FORMAT,
                        channels=AUDIO_CHANNELS,
                        rate=AUDIO_RATE,
                        frames_per_buffer=AUDIO_CHUNK,
                        input=True)

        frames = []  # Initialize array to store frames

        # Store data in chunks for 20 seconds
        for i in range(0, int(AUDIO_RATE / AUDIO_CHUNK * AUDIO_CHUNK_SECONDS)):
            data = stream.read(AUDIO_CHUNK)
            frames.append(data)

        # Stop and close the stream
        stream.stop_stream()
        stream.close()
        # Terminate the PortAudio interface
        p.terminate()

        print('Finished recording')

        # Save the recorded data as a WAV file
        wf = wave.open(AUDIO_FILENAME, 'wb')
        wf.setnchannels(AUDIO_CHANNELS)
        wf.setsampwidth(p.get_sample_size(AUDIO_SAMPLE_FORMAT))
        wf.setframerate(AUDIO_RATE)
        wf.writeframes(b''.join(frames))
        wf.close()

    @staticmethod
    def set_video_source(source):
        print(f"setting video source to {source}")
        OpenCvCamera.video_source = source

    @staticmethod
    def frames():
        print('initializing VideoCapture')

        camera = cv2.VideoCapture(
            OpenCvCamera.video_source)  # , apiPreference=cv2.CAP_V4L2)
        if not camera.isOpened():
            raise RuntimeError('Could not start camera.')

        camera.set(cv2.CAP_PROP_FRAME_WIDTH, FRAME_SIZE[0])
        camera.set(cv2.CAP_PROP_FRAME_HEIGHT, FRAME_SIZE[1])
        camera.set(cv2.CAP_PROP_FOURCC,
                   cv2.VideoWriter_fourcc('M', 'J', 'P', 'G'))
        camera.set(cv2.CAP_PROP_FPS, CAPTURE_FPS)

        while True:
            _, img = camera.read()
            if img is None:
                if not OpenCvCamera.img_is_none_messaged:
                    logger.error(
                        "The camera has not read data, please check whether the camera can be used normally.")
                    logger.error(
                        "Use the command: 'raspistill -t 1000 -o image.jpg' to check whether the camera can be used correctly.")
                    OpenCvCamera.img_is_none_messaged = True
                continue

            if OpenCvCamera.recording_started_at != None:
                OpenCvCamera.captured_frames.append(img)
                duration = time.time() - OpenCvCamera.recording_started_at
                if duration >= RECORDING_DURATION:
                    OpenCvCamera.recording_started_at = None
                    capture_fps = len(OpenCvCamera.captured_frames) / duration
                    print(
                        f"saving file {RAW_RECORDING_FILE} {len(OpenCvCamera.captured_frames)} frames")

                    writer = cv2.VideoWriter(RAW_RECORDING_FILE,
                                             cv2.VideoWriter_fourcc(*'mp4v'),
                                             capture_fps,
                                             FRAME_SIZE
                                             )
                    for frame in OpenCvCamera.captured_frames:
                        writer.write(frame)

                    writer.release()
                    print(f"saved file {RAW_RECORDING_FILE}")
                    OpenCvCamera.captured_frames = []

                    OpenCvCamera.audio_thread.join()

                    print(f"combining video and audio")
                    os.system(
                        f"ffmpeg -y -i {RAW_RECORDING_FILE} -i {AUDIO_FILENAME} -c:v copy -c:a aac -vcodec h264 -acodec aac -strict -2  {constants.LAST_AV_FILE}")

                    print("done.  new_video is ready")
                    OpenCvCamera.is_new_video_ready = True

            yield img
