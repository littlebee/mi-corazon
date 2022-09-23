"""
"""
import sys
import time
import threading

from rpi_ws281x import PixelStrip


PINK = (168, 50, 105)
RED = (255, 0, 0)
BLUE = (0, 0, 128)
BLACK = (0, 0, 0)
BRIGHT_WHITE = (255, 255, 255)

BPM_NORMAL = 60
BPM_SLEEPING = 40
BPM_EXCITED = 110

LED_COUNT = 16      # Number of LED pixels.
LED_PIN = 12      # GPIO pin connected to the pixels (18 uses PWM!).
LED_FREQ_HZ = 800000  # LED signal frequency in hertz (usually 800khz)
LED_DMA = 10      # DMA channel to use for generating signal (try 10)
LED_BRIGHTNESS = 255     # Set to 0 for darkest and 255 for brightest
# True to invert the signal (when using NPN transistor level shift)
LED_INVERT = False
LED_CHANNEL = 0       # set to '1' for GPIOs 13, 19, 41, 45 or 53

# all LEDs to black
MODE_OFF = 0
# no animation, just on
MODE_ON = 1
# a pulsing heartbeat animation
MODE_HEARTBEAT = 2
#


class Leds:
    thread = None
    color = BLACK  # background thread that reads frames from camera
    next_color = PINK
    bpm = BPM_SLEEPING

    # use setMode to change
    mode = MODE_OFF

    strip = None

    def __init__(self):
        if Leds.strip is None:
            Leds.strip = PixelStrip(
                LED_COUNT,
                LED_PIN,
                LED_FREQ_HZ,
                LED_DMA,
                LED_INVERT,
                LED_BRIGHTNESS,
                LED_CHANNEL
            )
            Leds.strip.begin()

        if Leds.thread is None:
            Leds.thread = threading.Thread(target=self._thread)
            # Leds.thread.start()

    def setMode(self, mode):
        Leds.mode = mode

    def pink(self):
        Leds.next_color = PINK
        return self

    def red(self):
        Leds.next_color = RED
        return self

    def blue(self):
        Leds.next_color = BLUE
        return self

    def bright_white(self):
        Leds.next_color = BRIGHT_WHITE
        return self

    def normal(self):
        Leds.bpm = BPM_NORMAL
        return self

    def sleeping(self):
        Leds.bpm = BPM_SLEEPING
        return self

    def excited(self):
        Leds.bmp = BPM_EXCITED
        return self

    @classmethod
    def _thread(cls):
        cls.started_at = time.time()

        while True:
            if cls.mode == MODE_HEARTBEAT:
                bps = cls.bpm / 60

                if cls.next_color != cls.color:
                    cls.fadeTo(cls.next_color, 40, 1)
                    cls.color = cls.next_color

                # simulate Ledsbeat
                cls.fill(cls.color)  # red
                time.sleep(.25 / bps)
                cls.fill(BLACK)
                time.sleep(.1 / bps)
                cls.fill(cls.color)
                cls.fadeTo(BLACK, 20, .6 / bps)
            elif cls.mode == MODE_OFF:
                cls.fill(BLACK)
                time.sleep(.2)
            elif cls.mode == MODE_ON:
                cls.fill(cls.next_color)
                time.sleep(.2)

    @classmethod
    def fill(cls, rgb):
        (r, g, b) = rgb
        for i in range(cls.strip.numPixels()):
            cls.strip.setPixelColorRGB(i, r, g, b, 255)
            cls.strip.show()

    # fade from current color to rgb

    @ classmethod
    def fadeTo(cls, rgb, steps, duration):
        (r1, g1, b1) = cls.color
        (r2, g2, b2) = rgb
        r_inc = (r1 - r2) / steps
        g_inc = (g1 - g2) / steps
        b_inc = (b1 - b2) / steps

        r = r1
        g = g1
        b = b1

        for i in range(steps):
            r -= r_inc
            g -= g_inc
            b -= b_inc
            cls.fill((int(r), int(g), int(b)))
            time.sleep(duration / steps)


if __name__ == '__main__':
    Leds = Leds()

    while 1:
        time.sleep(1)
