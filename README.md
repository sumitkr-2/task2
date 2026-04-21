# Audio Transfer Project

## Fixed & Enhanced
- Sender (`http://localhost:4000/sender`): Upload audio → compresses to 64kbps MP3 → shows sizes.
- Receiver (`http://localhost:4000/receiver`): Get Audio → shows file details (name, original/compressed sizes, **compression loss %**) + plays audio.

## Compression Loss
Computed & displayed on receiver:  
`Loss % = ((original - compressed) / original) * 100`  
Persisted via `compressed/latest.json`.

**Optimized for lower loss:** 32kbps bitrate + 22.05kHz sample rate (reduced from 64kbps).

## Test Flow
1. Open sender, pick any audio file (mp3/wav/etc).
2. Click Send → see sizes on sender.
3. Open receiver, click Get Audio → see full details incl. loss % + play audio.

Server running on 4000 (npm start). FFmpeg 8.1 used for compression.

Details shown via /files endpoint (e.g. curl http://localhost:4000/files after upload).
