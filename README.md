
# FocusFlow ⏱️

A clean, minimal Pomodoro timer Chrome extension to help you stay focused and productive.

## Features

- 🔴 25-minute focus sessions with 5-minute breaks
- 🔵 Animated SVG progress ring that drains as time runs out
- 🔔 Chrome notifications when focus/break ends
- 💾 Session count persisted across popup closes
- ⏸️ Pause and resume timer — even after closing the popup
- 🎨 Auto color switch between focus (red) and break (blue) mode

## Tech Used

- Vanilla JavaScript
- Chrome Extension APIs — `chrome.storage`, `chrome.notifications`, `chrome.alarms`
- SVG animation with `stroke-dashoffset`
- CSS class-based theming
- Chrome Service Worker (`background.js`)

## Installation

1. Clone this repo
```bash
   git clone https://github.com/YOUR_USERNAME/focusflow.git
```
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer Mode** (top right)
4. Click **Load Unpacked**
5. Select the `focusflow` folder
6. Pin the extension and click the icon to start!

## How It Works

- Click **Start** to begin a 25 minute focus session
- The red ring drains as time counts down
- When focus ends, a Chrome notification fires and break timer starts automatically
- Ring turns blue during break mode
- Click **Stop** to pause — timer state is saved and restored when you reopen
- Click **Reset** to start fresh
- Session count is saved to `chrome.storage` and persists across sessions

## Project Structure