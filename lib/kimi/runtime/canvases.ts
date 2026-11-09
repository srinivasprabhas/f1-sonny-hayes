import { Spring, TRIGGER } from "../engine/spring";
import { loopInView, scrub } from "../engine/trigger";

const readColour = (token: string) => {
  const probe = document.createElement("span");
  probe.style.cssText = `position:absolute;visibility:hidden;color:var(${token})`;
  document.body.appendChild(probe);
  const value = getComputedStyle(probe).color;
  probe.remove();
  return value;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/* ─────────────── The sticky stack's recede ─────────────── */

const RECEDE_SCALE = 0.9;
const RECEDE_SHADE = 0.55;

export const initStack = (root: ParentNode) => {
  const pinned = [...root.querySelectorAll<HTMLElement>("[data-stack-layer]")].map((layer) => ({
    inner: layer.querySelector<HTMLElement>("[data-stack-inner]")!,
    shade: layer.querySelector<HTMLElement>("[data-stack-shade]")!,
    next: layer.nextElementSibling as HTMLElement,
  }));
  const phone = window.matchMedia("(max-width: 639px)");
  const apply = () => {
    const view = window.innerHeight || 1;
    const shrink = phone.matches ? 0 : 1 - RECEDE_SCALE;
    for (const { inner, shade, next } of pinned) {
      const p = Math.min(1, Math.max(0, 1 - next.getBoundingClientRect().top / view));
      inner.style.transform = p > 0 && shrink > 0 ? `scale(${1 - shrink * p})` : "";
      inner.style.willChange = p > 0 && shrink > 0 ? "transform" : "";
      shade.style.opacity = `${RECEDE_SHADE * p}`;
      inner.style.visibility = p >= 1 ? "hidden" : "visible";
    }
  };
  let frame = 0;
  const onScroll = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      apply();
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  apply();
  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    cancelAnimationFrame(frame);
  };
};

/* ─────────────── The chequered dissolve ─────────────── */

const CELL = 24;
const SOLID_UNTIL = 0.16;
const LIFT = 2;
const ACCENT_SHARE = 0.06;
const noise = (x: number, y: number) => {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};

const initDissolve = (canvas: HTMLCanvasElement) => {
  const carry = canvas.dataset.dissolve === "light" ? "light" : "dark";
  const context = canvas.getContext("2d")!;
  let progress = 0;
  let width = 0;
  let height = 0;
  let accent = "";
  let surface = "";
  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.max(1, Math.round(width * ratio));
    canvas.height = Math.max(1, Math.round(height * ratio));
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    accent = readColour("--accent");
    surface = readColour(carry === "light" ? "--background" : "--surface-black");
    render();
  };
  const render = () => {
    const custom = Number.parseFloat(getComputedStyle(canvas).getPropertyValue("--flag-cell"));
    const cell = Number.isFinite(custom) && custom > 0 ? custom : CELL;
    context.clearRect(0, 0, width, height);
    const columns = Math.ceil(width / cell);
    const rows = Math.ceil(height / cell);
    const lift = progress * LIFT;
    for (let y = 0; y < rows; y += 1) {
      const depth = y / Math.max(1, rows - 1) + lift;
      if (depth > 1) break;
      const solid = depth <= SOLID_UNTIL;
      const fade = clamp01(1 - (depth - SOLID_UNTIL) / (1 - SOLID_UNTIL));
      if (!solid && fade <= 0) break;
      for (let x = 0; x < columns; x += 1) {
        if (!solid) {
          if ((x + y) % 2 !== 0) continue;
          if (noise(x, y) > fade) continue;
        }
        context.fillStyle = !solid && noise(x + 101, y + 57) < ACCENT_SHARE ? accent : surface;
        context.fillRect(x * cell, y * cell, cell, cell);
      }
    }
  };
  const spring = new Spring(0, TRIGGER, (v) => {
    progress = v;
    render();
  }, 0.001);
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();
  let first = true;
  const stop = scrub(canvas, {
    start: "top_bottom",
    end: "top_top",
    onProgress: (p) => {
      if (first) {
        first = false;
        spring.set(p);
      } else spring.to(p);
    },
  });
  return () => {
    stop();
    ro.disconnect();
    spring.dispose();
  };
};

export const initDissolves = (root: ParentNode) => {
  const stops = [...root.querySelectorAll<HTMLCanvasElement>("canvas[data-dissolve]")].map(initDissolve);
  return () => stops.forEach((s) => s());
};

/* ─────────────── The contour backdrop (marching squares) ─────────────── */

const LINE_SCALE = 3.8, LINE_COUNT = 2.5, WAVE_AMOUNT = 0.37, WAVE_SPEED = 1.66, LINE_OPACITY = 0.85;
const CELLS = 96;
const field = (x: number, y: number, t: number) => {
  let f = Math.sin(x * 1.0 + t * 0.6) * 0.5;
  f += Math.sin(y * 0.85 - t * 0.45) * 0.45;
  f += Math.sin((x + y) * 0.65 + t * 0.35) * 0.35;
  f += Math.sin((x - y) * 0.95 - t * 0.55) * 0.25;
  return f * 0.5 + 0.5;
};

const initContour = (canvas: HTMLCanvasElement, start: number) => {
  const context = canvas.getContext("2d")!;
  const colour = readColour(canvas.dataset.contours || "--paddock-contour");
  let width = 0;
  let height = 0;
  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.max(1, Math.round(width * ratio));
    canvas.height = Math.max(1, Math.round(height * ratio));
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw(performance.now());
  };
  const draw = (now: number) => {
    if (!width || !height) return;
    const t = ((now - start) / 1000) * WAVE_SPEED;
    context.clearRect(0, 0, width, height);
    const cols = width >= height ? CELLS : Math.max(8, Math.round((CELLS * width) / height));
    const rows = Math.max(8, Math.round((cols * height) / width));
    const stepX = width / cols, stepY = height / rows, aspect = width / height;
    const values = new Float32Array((cols + 1) * (rows + 1));
    for (let j = 0; j <= rows; j += 1) for (let i = 0; i <= cols; i += 1) {
      const nx = ((i / cols) * 2 - 1) * aspect * LINE_SCALE;
      const ny = ((j / rows) * 2 - 1) * LINE_SCALE;
      const qx = nx + Math.sin(ny * 0.8 + t * 0.7) * WAVE_AMOUNT;
      const qy = ny + Math.cos(nx * 0.7 - t * 0.6) * WAVE_AMOUNT;
      values[j * (cols + 1) + i] = field(qx, qy, t) * LINE_COUNT;
    }
    context.strokeStyle = colour;
    context.lineWidth = 1; context.globalAlpha = LINE_OPACITY; context.beginPath();
    type P = [number, number];
    const segment = (p: P, q: P) => { context.moveTo(p[0], p[1]); context.lineTo(q[0], q[1]); };
    for (let level = 0.5; level < LINE_COUNT; level += 1)
      for (let j = 0; j < rows; j += 1) for (let i = 0; i < cols; i += 1) {
        const a = values[j * (cols + 1) + i], b = values[j * (cols + 1) + i + 1];
        const c = values[(j + 1) * (cols + 1) + i + 1], d = values[(j + 1) * (cols + 1) + i];
        const index = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
        if (index === 0 || index === 15) continue;
        const x0 = i * stepX, y0 = j * stepY;
        const top: P = [x0 + stepX * ((level - a) / (b - a)), y0];
        const right: P = [x0 + stepX, y0 + stepY * ((level - b) / (c - b))];
        const bottom: P = [x0 + stepX * ((level - d) / (c - d)), y0 + stepY];
        const left: P = [x0, y0 + stepY * ((level - a) / (d - a))];
        switch (index) {
          case 1: case 14: segment(left, bottom); break;
          case 2: case 13: segment(bottom, right); break;
          case 3: case 12: segment(left, right); break;
          case 4: case 11: segment(top, right); break;
          case 6: case 9: segment(top, bottom); break;
          case 7: case 8: segment(left, top); break;
          case 5: segment(left, top); segment(bottom, right); break;
          case 10: segment(left, bottom); segment(top, right); break;
        }
      }
    context.stroke(); context.globalAlpha = 1;
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stop = reduced ? () => {} : loopInView(canvas, draw, () => 24);
  return () => {
    stop();
    ro.disconnect();
  };
};

export const initContours = (root: ParentNode) => {
  const start = performance.now();
  const stops = [...root.querySelectorAll<HTMLCanvasElement>("canvas[data-contours]")].map((c) => initContour(c, start));
  return () => stops.forEach((s) => s());
};
