# Video2Text

A simple demo application that converts audio or video to text. The frontend is built with HTML, Tailwind CSS and FontAwesome. The backend uses only the Node.js standard library so it can run without installing extra packages. The transcription logic is still a placeholder returning demo text.

## Prerequisites

- Node.js >= 14
- npm

## Setup

There are no external dependencies, so nothing needs to be installed before running.

## Run the application

```bash
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Notes

This demo includes only placeholder logic for transcription. To make it production-ready you would integrate a real speech-to-text engine (for example Whisper or Vosk) inside `server/server.js` and handle a wider range of media formats.
