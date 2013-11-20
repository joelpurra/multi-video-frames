# multi-video-frames
*Play/view multiple video player streams in the same browser window by using iframes.*

Project page and live version: http://joelpurra.com/projects/multi-video-frames/

<img src="http://joelpurra.com/projects/multi-video-frames/sample-olympic-games-summer-2012.jpg" alt="Screenshot of multi-video-frames in action during the 2012 Summer Olympic Games, by Svarten"  title="Screenshot of multi-video-frames in action during the 2012 Summer Olympic Games, by Svarten" />  
Screenshot of multi-video-frames in action during the 2012 Summer Olympic Games, by Svarten.

## Usage

1. Go to http://joelpurra.com/projects/multi-video-frames/
1. Click the button to add frame.
1. Enter any URL into the address box.
1. Unfocus the address box (press tab or click outside the box) to load the URL into the frame.
1. Rinse, repeat, enjoy.

Sample URLs
* `http://www.ustream.tv/embed/6540154`
* `http://endofworld.net/endofworld.swf`
* `http://blip.tv/play/hdljgpC1ZQI.html?p=1`
* `http://www.youtube.com/embed/oHg5SJYRHA0`

## Fixes for YouTube
The regular URL will not work ([`X-Frame-Options:SAMEORIGIN`](https://google.com/?q=X-Frame-Options:SAMEORIGIN)) - but there's a special embed URL that works just fine! Convert the top address to the below adress, by copying the video id. YouTube also has an embed button, as desribed below.

* `http://www.youtube.com/watch?v=VIDEOID`
* `http://www.youtube.com/embed/VIDEOID`

Example

* `http://www.youtube.com/watch?v=oHg5SJYRHA0`
* `http://www.youtube.com/embed/oHg5SJYRHA0`

## Generic "full screen" video

If you can find an "embed" button on your favorite video site, there's usually a URL that can be extracted and used as a "full screen"/"full frame" version. The blip.tv sample URL above was extracted from the embed code at [Day9's MaNa (P) vs Naama (T) Game 1 DHW10 Grand Finals cast](http://blip.tv/day9tv/mana-p-vs-naama-t-game-1-grand-finals-dreamhack-steelseries-tournament-4463233), and the UStream code was found through [Nasa TV/UStream](http://www.nasa.gov/multimedia/nasatv/ustream.html).

## TODO list
*Patches/pull requests are welcome!*

* Click to close a frame.
* Remember URL history.
* Dynamic frame resize by dragging handles, as it would work in a normal non-browser window.
* Optionally extract the video object (or hide everything else) when loading new URLs, to get a clutter-free view.
* Convert from known URL formats to better URL formats (see YouTube workaround).

## License
Copyright (c) 2012, Joel Purra <http://joelpurra.se/>
All rights reserved.

When using multi-video-frames, comply to at least one of the three available licenses: BSD, MIT, GPL.
Please see the LICENSE file for details.


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/joelpurra/multi-video-frames/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

