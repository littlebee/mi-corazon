import os


# which v4l channel  is the rgb image read from
CAMERA_CHANNEL_PICAM = 0 if not os.getenv(
    'CAMERA_CHANNEL_PICAM') else int(os.getenv('CAMERA_CHANNEL_PICAM'))

LAST_AV_FILE = "data/new_video.mp4"
SAVED_VIDEOS_DIR = "/home/pi/Videos"
