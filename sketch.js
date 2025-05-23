let totalMovement = 0;
let positions = [];
let colorsUsed = new Set();
let strokeWeights = [];
let brushTypes = [];
let currentColor;
let messages;
let isEraser = false;
let brushMode = "normal";
let mood = "";

// 🌸 한글 운세 단어 리스트
const koreanFortunes = [
  { word: "사랑", meaning: "Love" },
  { word: "행복", meaning: "Happiness" },
  { word: "평화", meaning: "Peace" },
  { word: "희망", meaning: "Hope" },
  { word: "성장", meaning: "Growth" },
  { word: "치유", meaning: "Healing" },
  { word: "모험", meaning: "Adventure" },
  { word: "기회", meaning: "Opportunity" },
  { word: "자유", meaning: "Freedom" },
  { word: "깨달음", meaning: "Awakening" }
];

function preload() {
  loadJSON("fortunes.json", data => messages = data);
}

function setup() {
  const canvas = createCanvas(400, 400);
  canvas.parent("canvas-container");
  background(255);
}

function draw() {
  let activeBrush = typeof getBrushMode === 'function' ? getBrushMode() : "normal";
  brushMode = activeBrush;
  isEraser = brushMode === "eraser";

  if (mouseIsPressed && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    currentColor = isEraser ? color(255) : document.getElementById("colorPicker").value;
    let penSize = parseInt(document.getElementById("penSize").value);
    strokeWeight(penSize);
    stroke(currentColor);

    if (brushMode === "dotted") {
      if (frameCount % 5 === 0) point(mouseX, mouseY);
    } else if (brushMode === "soft") {
      for (let i = 0; i < 10; i++) {
        let offsetX = random(-penSize / 2, penSize / 2);
        let offsetY = random(-penSize / 2, penSize / 2);
        point(mouseX + offsetX, mouseY + offsetY);
      }
    } else {
      line(pmouseX, pmouseY, mouseX, mouseY);
    }

    if (!isEraser) colorsUsed.add(currentColor);
    totalMovement += dist(pmouseX, pmouseY, mouseX, mouseY);
    positions.push({ x: mouseX, y: mouseY });
    strokeWeights.push(penSize);
    brushTypes.push(brushMode);
  }
}

function performAnalysis() {
  if (positions.length === 0) {
    document.getElementById("result").innerText = "Please draw something first!";
    return;
  }

  let sumX = 0, sumY = 0;
  for (let pos of positions) {
    sumX += pos.x;
    sumY += pos.y;
  }
  const avgX = sumX / positions.length;
  const avgY = sumY / positions.length;

  let message = "✨ Your Drawing Analysis Result ✨\n\n";

  const colorCount = colorsUsed.size;
  const avgWeight = strokeWeights.reduce((a, b) => a + b, 0) / strokeWeights.length;

  if (colorCount >= 6 && totalMovement > 5000) mood = "energetic";
  else if (totalMovement < 1000) mood = "tired";
  else if (avgY > height * 0.6 && avgWeight < 5) mood = "calm";
  else mood = "chaotic";

  message += messages.amount[getRange(positions.length)] + "\n";
  message += messages.color[getRange(colorCount)] + "\n";
  message += messages.weight[getWeight(avgWeight)] + "\n";

  const softCount = brushTypes.filter(b => b === "soft").length;
  const dottedCount = brushTypes.filter(b => b === "dotted").length;
  message += softCount > brushTypes.length / 2 ? messages.brush.soft + "\n"
           : dottedCount > brushTypes.length / 2 ? messages.brush.dotted + "\n"
           : messages.brush.normal + "\n";

  message += avgY < height * 0.3 ? messages.positionY.top + "\n"
           : avgY > height * 0.7 ? messages.positionY.bottom + "\n"
           : messages.positionY.center + "\n";

  message += avgX < width * 0.3 ? messages.positionX.left + "\n"
           : avgX > width * 0.7 ? messages.positionX.right + "\n"
           : messages.positionX.center + "\n";

  message += totalMovement < 1000 ? messages.movement.low + "\n"
           : totalMovement > 6000 ? messages.movement.high + "\n"
           : "";

  message += "\n🎵 Mood of the Day: " + mood + "\n";

  // 🌸 오늘의 한글 운세 추가
  const randomKo = koreanFortunes[Math.floor(Math.random() * koreanFortunes.length)];
  message += `🌸 Your Korean fortune word of the day is: ${randomKo.word} (${randomKo.meaning})\n`;

  const bgm = document.getElementById("bgm");
  const musicMap = {
    energetic: "energetic.mp3",
    calm: "calm.mp3",
    tired: "tired.mp3",
    chaotic: "chaotic.mp3"
  };
  bgm.src = musicMap[mood];
  bgm.muted = true;
  bgm.play().then(() => {
    bgm.muted = false;
  }).catch(() => {
    console.warn("Autoplay was blocked. Click to enable music.");
  });

  fetch(`https://musicbrainz.org/ws/2/artist?query=tag:${mood}&fmt=json`)
    .then(res => res.json())
    .then(data => {
      const artist = data.artists && data.artists.length > 0 ? data.artists[0].name : "Unknown";
      message += `🎧 Recommended Artist: ${artist}`;
      document.getElementById("result").innerText = message;
    })
    .catch(() => {
      message += "🎧 Failed to load music data.";
      document.getElementById("result").innerText = message;
    });
}

function getRange(value) {
  if (value < 3) return "low";
  if (value > 10) return "high";
  return "medium";
}

function getWeight(w) {
  if (w <= 3) return "thin";
  if (w >= 10) return "thick";
  return "normal";
}
