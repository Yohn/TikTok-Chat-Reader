# TikTok-Chat-Reader
A chat reader for <a href="https://www.tiktok.com/live">TikTok LIVE</a> utilizing <a href="https://github.com/zerodytrash/TikTok-Live-Connector">TikTok-Live-Connector</a> and <a href="https://socket.io/">Socket.IO</a> to forward the data to the client. This demo project uses the unofficial TikTok API to retrieve chat comments, gifts and other events from TikTok LIVE.

## Demo: https://tiktok-chat-reader.zerody.one/

## Installation
To run the chat reader locally, follow these steps:

1. Install [Node.js](https://nodejs.org/) on your system
2. Clone this repository or download and extract [this ZIP file](https://github.com/Yohn/TikTok-Chat-Reader/archive/refs/heads/old.zip)
3. Open a console/terminal in the root directory of the project
4. Enter `npm i` to install all required dependencies
5. Enter `node server.js` to start the application server

Now you should see the following message: `Server running! Please visit http://localhost:8091`<br>
Simply open http://localhost:8091/ in your browser. Thats it.

If you have problems with Node.js, you can also just open the `index.html` from the `public` folder.<br>
This will use the server backend of the [demo site](https://tiktok-chat-reader.zerody.one/), which is sufficient for testing purposes. If you want to offer it to others or make many connections at the same time, please consider using your own server.

## Yohn's Updates
 - Separated everything away from the chat 
   - Likes (number is not correct
   - New followers
   - Shares
   - When users under gifter level 25 join
 - TTS - Text to Speech for comments (can be disabled)
 - Different sounds for gifts (can be disabled)
   - Best way to add / edit sounds is to add them to the config file
 - A way to save gifts sent in live to a google spreadsheet.
   - Will need to research yourself to add the `keys.json` file and to update your `.env` file
   - [Medium post might be helpful](https://medium.com/@shkim04/beginner-guide-on-google-sheet-api-for-node-js-4c0b533b071a) might help
 - Gifter badges
 - Team Member badges
 - Subscriber icon
 - Moderator icon
 - Battle scores, even for 2v2
   - Sometimes the battle scores come back to the wrong hosts. This is because of how its received from the [TikTok-Live-Connector](https://github.com/zerodytrash/TikTok-Live-Connector)
 - Battle timer
  - Sometimes the times off by a second, possibly more if the time booster was used  
 - If the gift is sent to someone in the guest boxes it will note that in the box area
   - If the receiver was not tapping, commenting or sending gifts since connecting the receiver will be blank.
 - Names entered to connect to the persons live are saved within the config file (works automatically)
 - Notes can be saved into the config file, or within the cog menu
 - Host info
 - Top 3 gifters before connecting  to the live

## Screenshot

![Screenshot 1](https://github.com/Yohn/TikTok-Chat-Reader/assets/2002591/7584c463-8000-4e9e-b923-2e0c48106b18)
![image](https://github.com/Yohn/TikTok-Chat-Reader/assets/2002591/09805565-de42-42be-8600-09d80aaf3c5b)
