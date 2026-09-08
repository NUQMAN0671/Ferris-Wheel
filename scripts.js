// ====================== Ferris Wheel Force Simulator ======================
// Modern portable version inspired by Open Source Physics (Belloni + lookang)

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// DOM elements
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

// Physics constants
const g = 9.81;               // m/s²
const NUM_CABINS = 12;

// State
let R = 50;                   // radius (m)
let v = 5;                    // tangential speed (m/s)
let m = 70;                   // mass (kg)
let theta = 0;                // angle from bottom (radians)  0 = bottom
let omega = 0;                // angular velocity
let isPlaying = false;
let lastTime = 0;

// Visual scale
const SCALE = 3.8;            // pixels per meter
const CENTER_X = canvas.width / 2;
const CENTER_Y = canvas.height / 2 + 10;

// ====================== Helper Functions ======================
function updateSliders() {
  R = parseFloat(radiusSlider.value);
  v = parseFloat(speedSlider.value);
  m = parseFloat(massSlider.value);

  omega = v / R;              // ω = v / R

  radiusValue.textContent = R + " m";
  speedValue.textContent  = v.toFixed(1) + " m/s";
  massValue.textContent   = m + " kg";
}

function forceScale(force) {
  // Scale force arrows for nice visual size
  return force * 0.018;
}

// ====================== Drawing ======================
function drawWheel() {
  // Outer rim
  ctx.beginPath();
  ctx.arc(CENTER_X, CENTER_Y, R * SCALE, 0, Math.PI * 2);
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 6;
  ctx.stroke();

  // Inner hub
  ctx.beginPath();
  ctx.arc(CENTER_X, CENTER_Y, 18, 0, Math.PI * 2);
  ctx.fillStyle = "#94a3b8";
  ctx.fill();

  // Spokes + cabins
  for (let i = 0; i < NUM_CABINS; i++) {
    const angle = theta + (i * 2 * Math.PI) / NUM_CABINS;
    const x = CENTER_X + R * SCALE * Math.sin(angle);
    const y = CENTER_Y + R * SCALE * Math.cos(angle);   // +cos so 0 is bottom

    // Spoke
    ctx.beginPath();
    ctx.moveTo(CENTER_X, CENTER_Y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Cabin
    ctx.beginPath();
    ctx.arc(x, y, 11, 0, Math.PI * 2);
    ctx.fillStyle = i === 0 ? "#38bdf8" : "#cbd5e1";
    ctx.fill();
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

function drawForces() {
  // Selected cabin is the blue one (i = 0)
  const angle = theta; // from bottom
  const x = CENTER_X + R * SCALE * Math.sin(angle);
  const y = CENTER_Y + R * SCALE * Math.cos(angle);

  // Physics (θ measured from bottom, positive counterclockwise)
  // Radial direction toward center: (-sinθ, -cosθ)
  const weight = m * g;
  const centripetal = m * (v * v) / R;          // magnitude of net force

  // At general position the normal force satisfies:
  // N - mg cosφ = ± mv²/R   (depending on definition of φ)
  // Here φ = angle from bottom → cos(angle) points outward at bottom?
  // Better: define θ = 0 at bottom.
  // At bottom: N - mg = + mv²/R  → N = mg + mv²/R
  // At top:    -N - mg = - mv²/R → N = mv²/R - mg   (or mg - mv²/R if slower)

  // Using the component of weight along the radial direction (toward center)
  // Radial unit vector (toward center): (-sinθ, -cosθ)
  // Weight vector: (0, +mg)   (down is positive y in canvas)
  // Component of weight toward center = weight • radialUnit

  const radialX = -Math.sin(angle);
  const radialY = -Math.cos(angle);

  // Weight component toward the center
  const weightTowardCenter = weight * radialY;   // only y component of weight

  // Net force must be toward center with magnitude m v²/R
  // Therefore: N_radial + weightTowardCenter = m v²/R
  // N points outward from the seat (away from center when sitting)
  // For a person, Normal is perpendicular to seat, roughly away from center if seat faces outward.

  // Simplified classic treatment:
  // N = m g cosα + m v²/R   where α is angle from top or bottom carefully.

  // Let's use the common textbook definition with θ measured from the lowest point:
  // At angle θ from bottom:
  // N = m g cosθ + m (v²/R)     when cosθ is positive at bottom? 
  // Actually standard is:
  // θ = 0 at bottom → N - mg = m v²/R  → N = mg + mv²/R
  // θ = π at top   → -N - mg = -mv²/R → N = mv²/R - mg

  // General: N = m (v²/R) + m g cosθ    where cosθ = +1 at bottom, -1 at top
  const N = m * (v * v) / R + m * g * Math.cos(angle);

  // Display values
  const apparentG = N / (m * g);

  angleValue.textContent    = (angle * 180 / Math.PI).toFixed(1) + "°";
  normalValue.textContent   = N.toFixed(1);
  weightValue.textContent   = weight.toFixed(1);
  netValue.textContent      = centripetal.toFixed(1);
  apparentValue.textContent = apparentG.toFixed(2);

  if (!showFBD.checked && !showNet.checked) return;

  // Draw arrows from the cabin
  const arrowScale = 0.9;

  // 1. Weight (down)
  if (showFBD.checked) {
    drawArrow(x, y, 0, forceScale(weight) * arrowScale, "#ef4444", 3);
  }

  // 2. Normal force (away from center = opposite of radial)
  if (showFBD.checked) {
    const nLen = forceScale(Math.abs(N)) * arrowScale;
    // Normal points roughly outward (away from center)
    const nx = -radialX * Math.sign(N) * nLen;   // careful with sign
    const ny = -radialY * Math.sign(N) * nLen;
    // Better: Normal is provided by the seat, for a typical Ferris wheel gondola it acts upward relative to the seat.
    // For simplicity and classic FBD we draw Normal opposite to the net required direction when needed.
    // Classic visual: Normal is drawn from the person outward along the radius when at bottom, etc.
    drawArrow(x, y, -radialX * forceScale(N) * arrowScale,
                    -radialY * forceScale(N) * arrowScale, "#22c55e", 3);
  }

  // 3. Net force (always toward center)
  if (showNet.checked) {
    const netLen = forceScale(centripetal) * arrowScale;
    drawArrow(x, y, radialX * netLen, radialY * netLen, "#a855f7", 2.5, true);
  }

  // Velocity vector (tangential)
  if (showVelocity.checked) {
    const tx = Math.cos(angle);   // tangential
    const ty = -Math.sin(angle);
    const vLen = Math.abs(v) * 2.2;
    drawArrow(x, y, tx * vLen * Math.sign(v), ty * vLen * Math.sign(v), "#38bdf8", 2);
  }
}

function drawArrow(x, y, dx, dy, color, width = 2, dashed = false) {
  const length = Math.hypot(dx, dy);
  if (length < 2) return;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = width;
  if (dashed) ctx.setLineDash([6, 4]);

  // Line
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + dx, y + dy);
  ctx.stroke();
  ctx.setLineDash([]);

  // Arrow head
  const angle = Math.atan2(dy, dx);
  const headLen = 11;
  ctx.beginPath();
  ctx.moveTo(x + dx, y + dy);
  ctx.lineTo(x + dx - headLen * Math.cos(angle - 0.35),
             y + dy - headLen * Math.sin(angle - 0.35));
  ctx.lineTo(x + dx - headLen * Math.cos(angle + 0.35),
             y + dy - headLen * Math.sin(angle + 0.35));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawCenterMark() {
  ctx.beginPath();
  ctx.arc(CENTER_X, CENTER_Y, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#f8fafc";
  ctx.fill();
}

// ====================== Animation Loop ======================
function animate(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  if (isPlaying) {
    theta += omega * dt;
    // keep theta in [0, 2π)
    theta = theta % (2 * Math.PI);
    if (theta < 0) theta += 2 * Math.PI;
  }

  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw
  drawWheel();
  drawForces();
  drawCenterMark();

  requestAnimationFrame(animate);
}

// ====================== Event Listeners ======================
radiusSlider.addEventListener("input", updateSliders);
speedSlider.addEventListener("input", updateSliders);
massSlider.addEventListener("input", updateSliders);

playBtn.addEventListener("click", () => {
  isPlaying = true;
});

pauseBtn.addEventListener("click", () => {
  isPlaying = false;
});

resetBtn.addEventListener("click", () => {
  isPlaying = false;
  theta = 0;
  updateSliders();
});

// Initial
updateSliders();
requestAnimationFrame(animate);
