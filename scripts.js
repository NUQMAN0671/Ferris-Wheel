* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  min-height: 100vh;
  padding: 16px;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
}

header {
  text-align: center;
  margin-bottom: 20px;
}

header h1 {
  font-size: 1.7rem;
  color: #f8fafc;
}

.subtitle {
  color: #94a3b8;
  font-size: 0.9rem;
  margin-top: 4px;
}

.main {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.canvas-wrapper {
  background: #1e293b;
  border-radius: 16px;
  padding: 10px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.4);
}

#canvas {
  display: block;
  background: #0f172a;
  border-radius: 12px;
  width: 100%;
  max-width: 640px;
  height: auto;
  touch-action: none;
}

.controls {
  background: #1e293b;
  border-radius: 16px;
  padding: 18px;
  width: 290px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.control-group label {
  font-size: 0.85rem;
  color: #94a3b8;
  display: block;
  margin-bottom: 4px;
}

.control-group input[type="range"] {
  width: 100%;
  accent-color: #38bdf8;
}

.control-group span {
  color: #38bdf8;
  font-weight: 600;
  font-size: 0.9rem;
}

.buttons {
  display: flex;
  gap: 8px;
}

button {
  flex: 1;
  padding: 11px 0;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
}

#playBtn  { background: #22c55e; color: white; }
#pauseBtn { background: #f59e0b; color: white; }
#resetBtn { background: #64748b; color: white; }

.checkboxes {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.9rem;
}

.checkboxes label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.info {
  background: #0f172a;
  border-radius: 10px;
  padding: 12px;
  font-size: 0.88rem;
  line-height: 1.55;
}

.info strong {
  color: #94a3b8;
}

.legend {
  font-size: 0.85rem;
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.dot {
  display: inline-block;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  margin-right: 7px;
}

.dot.weight { background: #ef4444; }
.dot.normal { background: #22c55e; }
.dot.net    { background: #c084fc; }

footer {
  text-align: center;
  margin-top: 24px;
  color: #64748b;
  font-size: 0.82rem;
}

@media (max-width: 800px) {
  .main {
    flex-direction: column;
    align-items: center;
  }
  .controls {
    width: 100%;
    max-width: 420px;
  }
}
