const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Controls
const radiusSlider = document.getElementById("radius");
const speedSlider  = document.getElementById("speed");
const massSlider   = document.getElementById("mass");

const radiusValue = document.getElementById("radiusValue");
const speedValue  = document.getElementById("speedValue");
const massValue   = document.getElementById("massValue");

const angleValue    = document.getElementById("angleValue");
const normalValue   = document.getElementById("normalValue");
const weightValue   = document.getElementById("weightValue");
const netValue      = document.getElementById("netValue");
const apparentValue = document.getElementById("apparentValue");

const showFBD      = document.getElementById("showFBD");
const showNet      = document.getElementById("showNet");
const showVelocity = document.getElementById("showVelocity");

const playBtn  = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

// Physics
const g = 9.81;
const NUM_CABINS = 12;

let R = 45;
let v = 4;
let m = 70;
let theta = 0;          // 0 = bottom
let omega = 0;
let isPlaying = false;
let lastTime = 0;

// Make canvas sharp on high-DPI screens (iPad)
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const displayWidth = Math.min(640, window.innerWidth - 40);
  const displayHeight = displayWidth * 0.85;

  canvas.style.width = displayWidth + "px";
  canvas.style.height = displayHeight + "px";

  canvas.width = displayWidth * dpr;
  canvas.height = displayHeight * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// ====================== Drawing ======================
function draw() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const cx = w / 2;
  const cy = h / 2 + 10;
  const scale = Math.min(w, h) * 0.38 / R;   // auto scale

  // Clear
  ctx.clearRect(0, 0, w, h);

  // Background circle guide
  ctx.beginPath();
  ctx.arc(cx, cy, R * scale, 0, Math.PI * 2);
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 8;
  ctx.stroke();

  // Hub
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.fillStyle = "#94a3b8";
  ctx.fill();

  // Spokes + cabins
  for (let i = 0; i < NUM_CABINS; i++) {
    const a = theta + (i * 2 * Math.PI) / NUM_CABINS;
    const x = cx + R * scale * Math.sin(a);
    const y = cy + R * scale * Math.cos(a);

    // Spoke
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Cabin
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fillStyle = (i === 0) ? "#38bdf8" : "#e2e8f0";
    ctx.fill();
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // ===== Forces on the blue cabin =====
  const a = theta;
  const x = cx + R * scale * Math.sin(a);
  const y = cy + R * scale * Math.cos(a);

  const weight = m * g;
  const cent = m * v * v / R;

  // N = mv²/R + mg cosθ   (θ=0 at bottom → cos=+1)
  const N = cent + m * g * Math.cos(a);
  const apparent = N / weight;

  // Update numbers
  angleValue.textContent    = (a * 180 / Math.PI).toFixed(1) + "°";
  normalValue.textContent   = N.toFixed(0);
  weightValue.textContent   = weight.toFixed(0);
  netValue.textContent      = cent.toFixed(0);
  apparentValue.textContent = apparent.toFixed(2);

  // Draw force arrows
  const forceScale = 0.022 * scale;

  if (showFBD.checked) {
    // Weight (red) - always down
    drawArrow(x, y, 0, weight * forceScale, "#ef4444", 3);

    // Normal (green) - along radius, outward
    const nx = Math.sin(a);
    const ny = Math.cos(a);
    drawArrow(x, y, nx * N * forceScale, ny * N * forceScale, "#22c55e", 3);
  }

  if (showNet.checked) {
    // Net force (purple) - toward center
    const rx = -Math.sin(a);
    const ry = -Math.cos(a);
    drawArrow(x, y, rx * cent * forceScale, ry * cent * forceScale, "#c084fc", 2.5, true);
  }

  if (showVelocity.checked && Math.abs(v) > 0.1) {
    const tx = Math.cos(a);
    const ty = -Math.sin(a);
    drawArrow(x, y, tx * v * 3.5, ty * v * 3.5, "#38bdf8", 2);
  }
}

function drawArrow(x, y, dx, dy, color, width, dashed = false) {
  const len = Math.hypot(dx, dy);
  if (len < 4) return;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = width;
  if (dashed) ctx.setLineDash([5, 4]);

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + dx, y + dy);
  ctx.stroke();
  ctx.setLineDash([]);

  // Arrow head
  const angle = Math.atan2(dy, dx);
  const head = 12;
  ctx.beginPath();
  ctx.moveTo(x + dx, y + dy);
  ctx.lineTo(x + dx - head * Math.cos(angle - 0.4), y + dy - head * Math.sin(angle - 0.4));
  ctx.lineTo(x + dx - head * Math.cos(angle + 0.4), y + dy - head * Math.sin(angle + 0.4));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ====================== Animation ======================
function animate(time) {
  if (!lastTime) lastTime = time;
  const dt = (time - lastTime) / 1000;
  lastTime = time;

  if (isPlaying) {
    omega = v / R;
    theta += omega * dt;
    if (theta > Math.PI * 2) theta -= Math.PI * 2;
    if (theta < 0) theta += Math.PI * 2;
  }

  draw();
  requestAnimationFrame(animate);
}

// ====================== Events ======================
function updateValues() {
  R = parseFloat(radiusSlider.value);
  v = parseFloat(speedSlider.value);
  m = parseFloat(massSlider.value);

  radiusValue.textContent = R + " m";
  speedValue.textContent  = v.toFixed(1) + " m/s";
  massValue.textContent   = m + " kg";
}

radiusSlider.addEventListener("input", updateValues);
speedSlider.addEventListener("input", updateValues);
massSlider.addEventListener("input", updateValues);

playBtn.addEventListener("click", () => isPlaying = true);
pauseBtn.addEventListener("click", () => isPlaying = false);
resetBtn.addEventListener("click", () => {
  isPlaying = false;
  theta = 0;
});

// Start
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
updateValues();
requestAnimationFrame(animate);
