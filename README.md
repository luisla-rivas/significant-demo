<picture>
 <source media="(prefers-color-scheme: dark)" srcset="media_previews/linkers.png">
 <source media="(prefers-color-scheme: light)" srcset="media_previews/linkers.png">
 <img alt="Significant" src="media_previews/linkers.png">
</picture>
<br>

## Significant-demo

Significant-demo is an example project of how to built a web-server using javascript and serving two html pages that allow interaction between them using socket low latency connection ports.

### 💧 Server.js

The server is programmed in javascript, making use of `express`, `path` and `http` libraries. We also require `socket.io` library to allow low latency communication between `control.html` and `index.html` pages, throught the server socket ports.

### 🚀 Control.html

This is the webpage that shows us the number of users connected to the https://myWebSite/index.html page, and allows us to send the play/pause commnand to the server, that will forward to every `index.html` page displayed in each user devices. That command will play o pause the video embeded in each `index.html` page of all connected users.

### 🖥️ Index.html

This webpage contains an html tag `<video></video>` that allows every connected user to enjoy the video linked when the `control.html` sends the play command. This video has been linked as an `.m3u8` file, making use of the [HTTP Live Streaming (HLS) technology](https://developer.apple.com/streaming/) for distributing live and on-demand stream video.

### 💛 How you see all working together

You can see in this video how a MacOS Safari, a MacOS Firefox and and real iPad Pro Safari browser (Quicktime capture) run a demo-video, when **Play** button is pressed in a `control.html` page.

<video>
    <source src="media_previews/significant-demo-capture.mov">
</video>