# TikTok-Chat-Reader
A chat reader for <a href="https://www.tiktok.com/live">TikTok LIVE</a> utilizing <a href="https://github.com/zerodytrash/TikTok-Live-Connector">TikTok-Live-Connector</a> and <a href="https://socket.io/">Socket.IO</a> to forward the data to the client. This demo project uses the unofficial TikTok API to retrieve chat comments, gifts and other events from TikTok LIVE.

### Demo: https://tiktok-chat-reader.zerody.one/
### New demo coming soon, hosting can be used on Heroku.com

## Set Up Google API
Make sure to set up your google dev api, enable the spreadsheet api and get the json file of the api credentials in a keys.json file, and email / share your spreadsheet with the app's email it provides. That spreadsheet you shared to your app will be updated whenevrr a gift gets sent.

## Installation
To run the chat reader locally, follow these steps:

1. Install [Node.js](https://nodejs.org/) on your system
2. Clone this repository or download and extract [this ZIP file](https://github.com/zerodytrash/TikTok-Chat-Reader/archive/refs/heads/main.zip)
3. Open a console/terminal in the root directory of the project
4. Enter `npm i` to install all required dependencies 
5. Enter `node server.js` to start the application server

Now you should see the following message: `Server running! Please visit http://localhost:8091`<br>
Simply open http://localhost:8091/ in your browser. Thats it.

If you have problems with Node.js, you can also just open the `index.html` from the `public` folder.<br>
This will use the server backend of the [demo site](https://tiktok-chat-reader.zerody.one/), which is sufficient for testing purposes. If you want to offer it to others or make many connections at the same time, please consider using your own server.

## Screenshot

![Screen Shot 2023-12-19 at 07 18 11-fullpage](https://github.com/Yohn/TikTok-Chat-Reader/assets/2002591/198baef0-7ef8-4679-87ab-ccb11d8804c7)
