#!/bin/bash

# echo on
set -x

# stop on all errors
set -e

TARGET_DIR="/home/pi/mi_corazon"

# sudo apt-get update
# sudo apt-get -y upgrade

# audio and video needs
sudo apt install -y ffmpeg python3-pyaudio
sudo pip3 install pyaudio

# opencv
sudo apt install -y libatlas-base-dev libjasper-dev libqtgui4  libqt4-test libhdf5-dev
sudo pip3 install flask opencv-contrib-python==4.5.5.62 imutils opencv-python==3.4.2.17 numpy==1.14.5
sudo pip3 install numpy --upgrade

# web browser
sudo apt install -y chromium-browser unclutter

# webserver (flask) and websockets
sudo pip3 install websockets flask flask_cors
sudo pip3 install pybase64 psutil


# needed for the LEDs in the heart
sudo pip3 install rpi-ws281x

# Make the webapp automatically start in raspian desktop, full screen
mkdir -p /home/pi/.config/lxsession/LXDE-pi/
# cp $TARGET_DIR/setup/files/lxe-autostart /home/pi/.config/lxsession/LXDE-pi/autostart
sudo cp $TARGET_DIR/setup/files/lxe-autostart /etc/xdg/lxsession/LXDE-pi/autostart
# chmod +x /home/pi/.config/lxsession/LXDE-pi/autostart

