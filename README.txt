JARVIS MOBILE PWA — V1 STARTER

What this is:
- A mobile-first JARVIS-inspired web app.
- English spoken replies.
- Tamil and English basic command matching.
- Browser speech input (English or Tamil selected from the dropdown).
- Text-to-speech replies.
- Basic time/date and open YouTube/Google commands.

Important limits:
- This is NOT a full ChatGPT/Gemini-level AI assistant yet.
- No AI API key is included. Do not put secret API keys in browser JavaScript.
- Speech recognition depends on browser support, microphone permission, and often an HTTPS website.
- Tamil + English mixed speech in one sentence may not be recognized perfectly.
- Opening websites may be blocked by browser pop-up settings.

How to use on your Android phone:
1. Extract the ZIP.
2. For a quick test, open index.html in Chrome. Some features (especially microphone and PWA install/offline mode) may not work from a local file.
3. For the full installable PWA experience, the files must be hosted on an HTTPS website.
4. Open that HTTPS website in Chrome, tap the browser menu, then choose "Add to Home screen" or "Install app" if offered.

Next development step:
Connect a secure backend to an AI service. Keep the API key on the backend, never inside index.html.
