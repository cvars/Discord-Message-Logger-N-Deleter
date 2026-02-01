# Discord Bot
  Discord Message Logger and Deleter for cleaning up DMs
  using discord.js-selfbot-v13 so this project is for educational purposes only.
  DO NOT SHARE YOUR DISCORD TOKEN ~ it's used for signing into an account without 2fa, password, and email

## Prerequisites
  - [Node.js](https://nodejs.org/) installed

### 1. Quick Start and Setup
Download and install Node.js from https://nodejs.org/

### 2. Get Your Discord Token
1. Log into Discord in your browser
2. Open Developer Tools (Ctrl+Shift+I)
3. Go to the Console tab
4. Copy and paste this script:

let token;
window.webpackChunkdiscord_app.push([[Symbol()], {}, o => {
    for (let e of Object.values(o.c)) {
        try {
            if (!e.exports || e.exports === window) continue;
            if (e.exports?.getToken) {
                token = e.exports.getToken();
                console.log("Token:", token);
            }
            for (let o in e.exports) {
                if (e.exports?.[o]?.getToken && "IntlMessagesProxy" !== e.exports[o][Symbol.toStringTag]) {
                    token = e.exports[o].getToken();
                    console.log("Token:", token);
                }
            }
        } catch {}
    }
}]);
window.webpackChunkdiscord_app.pop();

# Navigate to project folder
cd Discord-Message-Logger-N-Deleter

# Install required packages
npm install dotenv fs readline discord.js-selfbot-v13

# Final steps.
Create .env File in the Discord-Message-Logger-N-Deleter folder and copy paste DISCORD_TOKEN=your_discord_token_here with the token you copied.
run start.bat
