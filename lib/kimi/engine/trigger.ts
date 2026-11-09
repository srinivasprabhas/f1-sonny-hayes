import { subscribe } from "./ticker";
import { Spring, type SpringConfig, DEFAULT } from "./spring";

export type Pose =
  | "top_top" | "center_top" | "bottom_top"
  | "top_bottom" | "center_bottom" | "bottom_bottom"
  | "top_center" | "center_center" | "bottom_center";

const AFTER_FRAMES = 10;

/**
 * "Loop in view": calls `onFrame` from the shared ticker only while `element`
 * intersects the viewport, plus ten more frames after it leaves.
 */
export const loopInView = (
  element: Element,
  onFrame: (time: number) => void,
  getFramerate: () => number = () => 0,
) => {
  let visible = false;
  let after = 0;
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) after = AFTER_FRAMES;
  });
  io.observe(element);
  const stop = subscribe((time) => {
    if (!visible) {
      if (after <= 0) return;
      after -= 1;
    }
    onFrame(time);
  }, getFramerate);
  return () => {
    io.disconnect();
    stop();
  };
};

export const progressOf = (element: Element, start: Pose, end: Pose) => {
  const bb = element.getBoundingClientRect();
  const vh = window.innerHeight;
  const poses: Record<Pose, number> = {
    top_top: bb.top,
    center_top: bb.top + bb.height / 2,
    bottom_top: bb.bottom,
    top_bottom: bb.top - vh,
    center_bottom: bb.top + bb.height / 2 - vh,
    bottom_bottom: bb.bottom - vh,
    top_center: bb.top - vh / 2,
    center_center: bb.top + bb.height / 2 - vh / 2,
    bottom_center: bb.bottom - vh / 2,
  };
  const scrollStart = poses[start];
  const scrollEnd = poses[end];
  const length = Math.abs(scrollStart - scrollEnd) || 1;
  return Math.min(Math.max(0, 1 - (scrollStart + length) / length), 1);
};

/** Interpolates a bare number, "<n><unit>", or "fn(<n><unit>)". */
export const interpolate = (from: string | number, to: string | number, p: number) => {
  if (typeof from === "number" && typeof to === "number") return from + (to - from) * p;
  const re = /^([a-zA-Z]+\()?(-?[\d.]+)([a-z%]*)(\))?$/;
  const a = String(from).match(re);
  const b = String(to).match(re);
  if (!a || !b) return p < 1 ? from : to;
  const value = Number(a[2]) + (Number(b[2]) - Number(a[2])) * p;
  const unit = b[3] || a[3];
  const fn = b[1] || a[1];
  return fn ? `${fn}${value}${unit})` : `${value}${unit}`;
};

export interface ScrubOptions {
  start: Pose;
  end: Pose;
  onProgress?: (progress: number) => void;
  /** A smoothed copy of the progress, for readers that want it. */
  onInterpolated?: (progress: number) => void;
  interpolatedConfig?: SpringConfig;
}

export const scrub = (element: Element, options: ScrubOptions) => {
  let last = -1;
  const smooth = options.onInterpolated
    ? new Spring(0, options.interpolatedConfig ?? DEFAULT, options.onInterpolated, 0.001)
    : null;
  const stop = loopInView(
    element,
    () => {
      const p = progressOf(element, options.start, options.end);
      if (p === last) return;
      last = p;
      options.onProgress?.(p);
      smooth?.to(p);
    },
    () => 10,
  );
  // First read straight away so nothing paints at a wrong resting state.
  const p = progressOf(element, options.start, options.end);
  last = p;
  options.onProgress?.(p);
  smooth?.set(p);
  return () => {
    stop();
    smooth?.dispose();
  };
};

/** A parallax layer: moves `target.style[prop]` from → to across the window. */
export const parallax = (
  trigger: Element,
  target: HTMLElement,
  prop: "top",
  from: string,
  to: string,
  start: Pose = "top_bottom",
  end: Pose = "bottom_top",
) =>
  scrub(trigger, {
    start,
    end,
    onProgress: (p) => {
      target.style[prop] = String(interpolate(from, to, p));
    },
  });

/** Fires `onEnter` once when the element enters the viewport inset by rootMargin. */
export const inViewOnce = (
  element: Element,
  onEnter: () => void,
  rootMargin = "0px",
  threshold = 0,
) => {
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        io.disconnect();
        onEnter();
      }
    },
    { rootMargin, threshold },
  );
  io.observe(element);
  return () => io.disconnect();
};

export const inView = (
  element: Element,
  onChange: (visible: boolean) => void,
  rootMargin = "0px",
) => {
  const io = new IntersectionObserver(([entry]) => onChange(entry.isIntersecting), {
    rootMargin,
  });
  io.observe(element);
  return () => io.disconnect();
};
