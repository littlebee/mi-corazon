# mi-corazon

This project is an example of how NOT to do a digital picture and video recording frame.

I made the mistake of going with what I know best versus what is best for the application at hand. Using a web based UI was a tragic mistake even without the tragic mistakes I made therein.

Using a web browser and the HTML <video> tag means that the recorded audio and video must be muxed and encoded for the web before they can be viewed. This process takes 60 seconds to save the buffered video and audio frames to file and then run `ffmpeg` to combine to encode the video and audio to h264 and aac.

But the torpedo than sunk this bad design was that Chromium browser on Raspian Buster just could not display the final .mp4 smoothly. I tried numerous solutions:

https://raspberrypi.stackexchange.com/questions/4322/get-html5-videos-to-play-in-chromium-on-raspberry-pi
https://forums.raspberrypi.com/viewtopic.php?t=261294

I also tried it in Firefox on Raspian with the same result - about 1 frame every 5-10 seconds.

I then went down the road of various thought experiments,

- maybe use `cv2.imshow()` and position the window over the browser for playback.
- Use img instead of video tag. Stream the playback the way it does live video using multipart jpeg frames
- ...

But ultimately, I think all of those are just more workarounds for bad design. Is it really necessary to re-encode the video and audio at the time of recording if you can open a file and stream or blit the frames? Could you put off encoding the video and audio for transport until the user asks to share or export recorded video?

See, https://github.com/littlebee/love-frame for my next attempt at a solution to this application. It ditches the client-server arch, web ui, and instead uses Python and PyGame for all of the things.
