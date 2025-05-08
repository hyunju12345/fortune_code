# fortune_code

# Draw Your Fortune

When a user draws on the canvas, the movement and style of their drawing are analyzed to determine their emotional state for the day. Based on this analysis, the website suggests a matching playlist and delivers a Korean fortune word that reflects their mood.


## Features

- Interactive drawing canvas with multiple brush types (normal, dotted, soft, eraser)
- Real-time color and pen size customization
- Drawing data analysis based on:
  - Amount of drawing
  - Color usage
  - Stroke weight
  - Brush type
  - Drawing position (X/Y)
  - Movement
- Fortune messages based on psychological drawing traits
- Emotion-based music recommendation using the [MusicBrainz API](https://musicbrainz.org/)
- Daily Korean fortune word (with English meaning)
- Calming background and ambient vibe

## Technologies Used

- HTML / CSS / JavaScript
- [p5.js](https://p5js.org/)
- MusicBrainz API
- Figma (for background design and UI planning)


## /project-root
├── index.html
├── style.css
├── sketch.js
├── fortunes.json