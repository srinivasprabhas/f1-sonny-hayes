import { CIRCUIT_MARKERS, CIRCUIT_PATH, CIRCUIT_STEP } from "../season/circuit";
import { FLAG_CUT, LAP_LENGTH, MAP_VIEW, mapToArtboard } from "../season/map-vector";
import { SeasonDots, mix, type Rgb } from "../season/season-dots";
import { Loop, Spring, easeInOutSine, easeOutCubic, easeOutQuad } from "../engine/spring";
import { subscribe } from "../engine/ticker";
import { inView } from "../engine/trigger";

const readRgb = (token: string): Rgb => {
  const probe = document.createElement("span");
  probe.style.cssText = `position:absolute;visibility:hidden;color:var(${token})`;
  document.body.appendChild(probe);
  const value = getComputedStyle(probe).color;
  probe.remove();
  const m = value.match(/[\d.]+/g) ?? ["0", "0", "0"];
  return [Number(m[0]), Number(m[1]), Number(m[2])];
};

/* ─────────────── The lap ─────────────── */

const LAP_MS = 6000;
const LINE_WIDTH = 5.9;
const GLOW_WIDTH = 15;
const HEAD_UNITS = 210;
const COOL_MS = 800;
const MARKER_POP_UNITS = 90;
const CORNER_BRAKE = 9;
const CUT_CENTRE = mapToArtboard(FLAG_CUT.x, FLAG_CUT.y);
const CUT_SCALE = 1438.43 / 2560;
const CUT_ALONG = FLAG_CUT.along * CUT_SCALE;
const CUT_ACROSS = FLAG_CUT.across * CUT_SCALE;

const CUMULATIVE = CIRCUIT_PATH.reduce<number[]>((acc, point, index) => {
  if (index === 0) return [0];
  const previous = CIRCUIT_PATH[index - 1];
  acc.push(acc[index - 1] + Math.hypot(point[0] - previous[0], point[1] - previous[1]));
  return acc;
}, []);
const TOTAL = CUMULATIVE[CUMULATIVE.length - 1];

const TIME_AT = (() => {
  const count = CIRCUIT_PATH.length;
  const turn = new Array<number>(count).fill(0);
  for (let i = 1; i < count - 1; i += 1) {
    const [ax, ay] = CIRCUIT_PATH[i - 1]; const [bx, by] = CIRCUIT_PATH[i]; const [cx, cy] = CIRCUIT_PATH[i + 1];
    const ux = bx - ax, uy = by - ay, vx = cx - bx, vy = cy - by;
    const lengths = (Math.hypot(ux, uy) || 1) * (Math.hypot(vx, vy) || 1);
    turn[i] = Math.acos(Math.min(1, Math.max(-1, (ux * vx + uy * vy) / lengths)));
  }
  const window = 6;
  const smoothed = turn.map((_, i) => {
    let sum = 0, n = 0;
    for (let j = Math.max(0, i - window); j <= Math.min(count - 1, i + window); j += 1) { sum += turn[j]; n += 1; }
    return sum / n;
  });
  const accumulated = [0];
  for (let i = 1; i < count; i += 1) {
    const span = CUMULATIVE[i] - CUMULATIVE[i - 1];
    const speed = 1 / (1 + CORNER_BRAKE * smoothed[i]);
    accumulated.push(accumulated[i - 1] + span / speed);
  }
  const total = accumulated[count - 1] || 1;
  return accumulated.map((value) => value / total);
})();

const distanceAtTime = (time: number) => {
  if (time <= 0) return 0;
  if (time >= 1) return TOTAL;
  let low = 0, high = TIME_AT.length - 1;
  while (low < high - 1) { const mid = (low + high) >> 1; if (TIME_AT[mid] <= time) low = mid; else high = mid; }
  const span = TIME_AT[high] - TIME_AT[low] || 1;
  const ratio = (time - TIME_AT[low]) / span;
  return CUMULATIVE[low] + (CUMULATIVE[high] - CUMULATIVE[low]) * ratio;
};

type Point = readonly [number, number];
const rgba = ([r, g, b]: Rgb, alpha: number) => `rgb(${r} ${g} ${b} / ${alpha})`;

const trailUpTo = (distance: number) => {
  const out: Point[] = [];
  for (let i = 0; i < CIRCUIT_PATH.length; i += 1) {
    if (CUMULATIVE[i] <= distance) { out.push(CIRCUIT_PATH[i]); continue; }
    const a = CIRCUIT_PATH[i - 1], b = CIRCUIT_PATH[i];
    const ratio = (distance - CUMULATIVE[i - 1]) / (CUMULATIVE[i] - CUMULATIVE[i - 1]);
    out.push([a[0] + (b[0] - a[0]) * ratio, a[1] + (b[1] - a[1]) * ratio]);
    break;
  }
  return out;
};

const createLapRenderer = (context: CanvasRenderingContext2D) => {
  const accent = readRgb("--accent");
  const white = readRgb("--foreground-on-dark");
  const palette = { accent, white, bright: mix(accent, white, 0.55) };

  const stroke = (points: Point[], scale: number, from = 0) => {
    context.beginPath();
    context.moveTo(points[from][0] * scale, points[from][1] * scale);
    for (let i = from + 1; i < points.length; i += 1) context.lineTo(points[i][0] * scale, points[i][1] * scale);
    context.stroke();
  };
  const drawTrail = (points: Point[], scale: number, minWidth: number, glow: boolean, heat: number) => {
    if (points.length < 2) return;
    const width = Math.max(minWidth, LINE_WIDTH * scale);
    context.lineCap = "round"; context.lineJoin = "round";
    if (glow) {
      context.save();
      context.globalCompositeOperation = "lighter";
      context.strokeStyle = rgba(palette.accent, 0.05); context.lineWidth = GLOW_WIDTH * scale; stroke(points, scale);
      context.strokeStyle = rgba(palette.accent, 0.1); context.lineWidth = GLOW_WIDTH * 0.45 * scale; stroke(points, scale);
      context.restore();
    }
    const head = Math.max(2, Math.round(HEAD_UNITS / CIRCUIT_STEP));
    const from = Math.max(0, points.length - head);
    const tip = points[points.length - 1];
    const hot = context.createLinearGradient(points[from][0] * scale, points[from][1] * scale, tip[0] * scale, tip[1] * scale);
    hot.addColorStop(0, rgba(palette.accent, 0));
    hot.addColorStop(0.45, rgba(palette.accent, 0.9));
    hot.addColorStop(1, rgba(mix(palette.accent, palette.bright, heat), 1));
    context.strokeStyle = hot; context.lineWidth = width; stroke(points, scale, from);
    const coreFrom = Math.max(0, points.length - Math.round(head * 0.42));
    if (points.length - coreFrom > 1) {
      const core = context.createLinearGradient(points[coreFrom][0] * scale, points[coreFrom][1] * scale, tip[0] * scale, tip[1] * scale);
      core.addColorStop(0, rgba(palette.bright, 0));
      core.addColorStop(1, rgba(palette.white, 0.95 * heat));
      context.strokeStyle = core; context.lineWidth = Math.max(minWidth * 0.6, width * 0.38); stroke(points, scale, coreFrom);
    }
  };

  return (progress: number, heat: number) => {
    const distance = distanceAtTime(progress);
    const points = trailUpTo(distance);
    context.clearRect(0, 0, 1440, 800);
    if (points.length > 1) {
      drawTrail(points, 1, 0.6, true, heat);
      const [tx, ty] = points[points.length - 1];
      context.save(); context.globalCompositeOperation = "lighter";
      const spark = context.createRadialGradient(tx, ty, 0, tx, ty, LINE_WIDTH * 2.6);
      spark.addColorStop(0, rgba(palette.white, 0.85 * heat));
      spark.addColorStop(0.35, rgba(palette.bright, 0.4 * heat));
      spark.addColorStop(1, rgba(palette.accent, 0));
      context.fillStyle = spark; context.beginPath(); context.arc(tx, ty, LINE_WIDTH * 2.6, 0, Math.PI * 2); context.fill();
      context.restore();
    }
    context.save(); context.translate(CUT_CENTRE[0], CUT_CENTRE[1]); context.rotate((FLAG_CUT.angle * Math.PI) / 180);
    context.clearRect(-CUT_ALONG / 2, -CUT_ACROSS / 2, CUT_ALONG, CUT_ACROSS); context.restore();
    for (const marker of CIRCUIT_MARKERS) {
      if (distance < marker.d) continue;
      const age = Math.min(1, (distance - marker.d) / MARKER_POP_UNITS);
      const radius = 12 + (1 - age) * 14;
      const glow = context.createRadialGradient(marker.x, marker.y, 0, marker.x, marker.y, radius);
      glow.addColorStop(0, rgba(palette.bright, 0.5 + 0.45 * (1 - age)));
      glow.addColorStop(0.45, rgba(palette.accent, 0.32));
      glow.addColorStop(1, rgba(palette.accent, 0));
      context.save(); context.globalCompositeOperation = "lighter"; context.fillStyle = glow;
      context.beginPath(); context.arc(marker.x, marker.y, radius, 0, Math.PI * 2); context.fill(); context.restore();
      if (age < 1) {
        context.strokeStyle = rgba(palette.bright, (1 - age) * 0.6); context.lineWidth = 1;
        context.beginPath(); context.arc(marker.x, marker.y, 9 + age * 20, 0, Math.PI * 2); context.stroke();
      }
    }
    return distance;
  };
};

/** The lap path's bounding box padded 46 — the narrow fit's frame. */
const TRACK_BOX = (() => {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of CIRCUIT_PATH) {
    minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
  }
  const pad = 46;
  return { x: minX - pad, y: minY - pad, width: maxX - minX + pad * 2, height: maxY - minY + pad * 2 };
})();

const DRIFT_MS = 7000;
const PING_MS = 4200;
const PING_REACH = 86;
const SPIN_MS = 10000;

export const initSeason = (root: ParentNode) => {
  const section = root.querySelector<HTMLElement>("[data-season]");
  if (!section) return () => {};
  const cleanups: (() => void)[] = [];
  const frame = section.querySelector<HTMLElement>("[data-season-frame]")!;
  const stage = section.querySelector<HTMLElement>("[data-season-stage]")!;
  const trace = section.querySelector<HTMLCanvasElement>("[data-season-trace]")!;
  const dotsCanvas = section.querySelector<HTMLCanvasElement>("[data-season-dots]")!;
  const lapMask = section.querySelector<SVGPathElement>("[data-lap-mask]")!;
  const gridLines = [...section.querySelectorAll<SVGLineElement>("[data-grid-line]")];
  const ping = section.querySelector<SVGCircleElement>("[data-ping]")!;
  const meridian = section.querySelector<SVGEllipseElement>("[data-meridian]")!;
  const coarse = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Trace canvas */
  const context = trace.getContext("2d")!;
  const render = createLapRenderer(context);
  let lap = 0;
  let heat = 1;
  const sizeTrace = () => {
    const ratio = coarse ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    trace.width = 1440 * ratio;
    trace.height = 800 * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  };
  const draw = () => {
    const distance = render(lap, heat);
    const reveal = 1 - distance / TOTAL;
    lapMask.style.strokeDashoffset = String(60 + reveal * LAP_LENGTH);
  };

  /* Stage fit */
  const fit = () => {
    const w = frame.clientWidth;
    const h = frame.clientHeight;
    if (w >= 1024) {
      const s = Math.max(w / 1440, h / 800);
      stage.style.transform = `translate(${(w - 1440 * s) / 2}px, ${(h - 800 * s) / 2}px) scale(${s})`;
    } else {
      const s = w / TRACK_BOX.width;
      const cx = TRACK_BOX.x + TRACK_BOX.width / 2;
      const cy = TRACK_BOX.y + TRACK_BOX.height / 2;
      stage.style.transform = `translate(${w / 2 - cx * s}px, ${h / 2 - cy * s}px) scale(${s})`;
    }
  };

  /* Halftone */
  const dots = new SeasonDots(dotsCanvas, {
    dot: readRgb("--map-dot"),
    accent: readRgb("--accent"),
    bright: mix(readRgb("--accent"), readRgb("--foreground-on-dark"), 0.55),
    white: readRgb("--foreground-on-dark"),
  });

  const ro = new ResizeObserver(() => {
    fit();
    dots.bake();
  });
  ro.observe(frame);
  fit();
  sizeTrace();
  dots.bake();
  cleanups.push(() => ro.disconnect());

  /* Map loops, paused off screen */
  const drift = new Loop(DRIFT_MS, (v) => {
    const offset = String(v * 20.5);
    for (const line of gridLines) line.style.strokeDashoffset = offset;
  });
  const pinger = new Loop(PING_MS, (v) => {
    ping.setAttribute("r", String(10.63 + v * PING_REACH));
    ping.setAttribute("opacity", String(0.4 * (1 - v) ** 2));
  }, easeOutQuad);
  const spin = new Loop(SPIN_MS, (v) => {
    const turn = v * Math.PI * 2;
    meridian.setAttribute("rx", String(Math.max(0.5, Math.abs(Math.cos(turn)) * 18)));
  });
  const loops = [drift, pinger, spin];
  cleanups.push(
    inView(section, (visible) => loops.forEach((l) => (visible ? l.play() : l.pause()))),
    () => loops.forEach((l) => l.pause()),
  );

  /* Reticle — armed only after the lap has cooled */
  let armed = false;
  let stopClock: (() => void) | null = null;
  let sectionVisible = false;
  const runClock = () => {
    if (!armed || stopClock || !sectionVisible) return;
    dots.resetClock();
    stopClock = subscribe(() => dots.frame());
  };
  const pauseClock = () => {
    stopClock?.();
    stopClock = null;
  };
  cleanups.push(
    inView(section, (visible) => {
      sectionVisible = visible;
      if (visible) runClock();
      else pauseClock();
    }),
    pauseClock,
  );
  const pointerAllowed = !window.matchMedia("(hover: none)").matches && !reduced;
  if (pointerAllowed) {
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !armed) return;
      const s = section.getBoundingClientRect();
      const inside = event.clientX >= s.left && event.clientX <= s.right && event.clientY >= s.top && event.clientY <= s.bottom;
      const r = dotsCanvas.getBoundingClientRect();
      dots.target.x = ((event.clientX - r.left) / (r.width || 1)) * MAP_VIEW.width;
      dots.target.y = ((event.clientY - r.top) / (r.height || 1)) * MAP_VIEW.height;
      dots.target.on = inside;
    };
    const off = () => {
      dots.target.on = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", off);
    window.addEventListener("blur", off);
    cleanups.push(() => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", off);
      window.removeEventListener("blur", off);
    });
  }

  /* The lap: one 6-second pass when the block arrives, never re-run */
  const lapTween = new Spring(0, { duration: LAP_MS, easing: easeInOutSine }, (v) => {
    lap = v;
    draw();
  });
  const cool = new Spring(1, { duration: COOL_MS, easing: easeOutCubic }, (v) => {
    heat = v;
    draw();
  });
  cleanups.push(() => {
    lapTween.dispose();
    cool.dispose();
  });
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      lapTween.to(1, {
        onRest: () =>
          cool.to(0, {
            onRest: () => {
              armed = true;
              runClock();
            },
          }),
      });
    },
    { threshold: 0.35 },
  );
  io.observe(frame);
  cleanups.push(() => io.disconnect());

  return () => cleanups.forEach((fn) => fn());
};
