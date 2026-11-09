import { subscribe } from "./ticker";

export type SpringConfig =
  | { tension: number; friction: number }
  | { duration: number; easing?: (t: number) => number };

export const REVEAL = { tension: 90, friction: 26 };
export const ROW = { tension: 170, friction: 24 };
export const ITEM = ROW;
export const SHEET = { tension: 190, friction: 26 };
export const FIGURE = { tension: 200, friction: 24 };
export const TYPE = { tension: 210, friction: 24 };
export const YEAR = { tension: 190, friction: 24 };
export const COPY = { tension: 110, friction: 26 };
export const COPY_FAST = { tension: 150, friction: 24 };
export const NAME = { tension: 190, friction: 24 };
export const VEIL = { tension: 70, friction: 24 };
export const CLEAR = { tension: 140, friction: 26 };
export const LABEL = { tension: 110, friction: 26 };
export const PROGRESS_WAITING = { tension: 10, friction: 30 };
export const PROGRESS_READY = { tension: 170, friction: 26 };
export const YEAR_SETTLE = { tension: 32, friction: 26 };
export const TRIGGER = { tension: 140, friction: 30 };
export const DEFAULT = { tension: 170, friction: 26 };
export const IMMEDIATE = { duration: 1 };

const MAX_FRAME = 64;

/**
 * react-spring's damped spring (mass 1), stepped at 1ms substeps up to a 64ms
 * frame cap. A `{ duration, easing }` config is a plain tween.
 */
export class Spring {
  value: number;
  velocity = 0;
  target: number;
  config: SpringConfig;
  precision: number;
  private onChange: (value: number) => void;
  private onRest: (() => void) | null = null;
  private stop: (() => void) | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private last = 0;
  private tweenFrom = 0;
  private tweenStart: number | null = null;

  constructor(
    initial: number,
    config: SpringConfig,
    onChange: (value: number) => void,
    precision = 0.01,
  ) {
    this.value = initial;
    this.target = initial;
    this.config = config;
    this.onChange = onChange;
    this.precision = precision;
    onChange(initial);
  }

  to(
    target: number,
    options: { delay?: number; config?: SpringConfig; onRest?: () => void } = {},
  ) {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    const go = () => {
      this.timer = null;
      if (options.config) this.config = options.config;
      this.onRest = options.onRest ?? null;
      this.target = target;
      this.tweenFrom = this.value;
      this.tweenStart = null;
      if (this.value === target && this.velocity === 0) {
        this.finish();
        return;
      }
      this.run();
    };
    if (options.delay && options.delay > 0) this.timer = setTimeout(go, options.delay);
    else go();
  }

  set(value: number) {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.halt();
    this.value = value;
    this.target = value;
    this.velocity = 0;
    this.onChange(value);
  }

  dispose() {
    if (this.timer) clearTimeout(this.timer);
    this.halt();
  }

  private run() {
    if (this.stop) return;
    this.last = performance.now();
    this.stop = subscribe(this.step);
  }

  private halt() {
    this.stop?.();
    this.stop = null;
  }

  private finish() {
    this.halt();
    const done = this.onRest;
    this.onRest = null;
    done?.();
  }

  private step = (time: number) => {
    const config = this.config;
    if ("duration" in config) {
      if (this.tweenStart === null) this.tweenStart = time;
      const t = Math.min(1, (time - this.tweenStart) / Math.max(config.duration, 1e-6));
      const eased = config.easing ? config.easing(t) : t;
      this.value = this.tweenFrom + (this.target - this.tweenFrom) * eased;
      this.onChange(this.value);
      if (t >= 1) {
        this.value = this.target;
        this.velocity = 0;
        this.finish();
      }
      return;
    }
    const dt = Math.min(MAX_FRAME, Math.max(0, time - this.last));
    this.last = time;
    const steps = Math.max(1, Math.ceil(dt));
    const restVelocity = this.precision / 10;
    let position = this.value;
    let velocity = this.velocity;
    for (let n = 0; n < steps; n += 1) {
      const springForce = -config.tension * 0.000001 * (position - this.target);
      const dampingForce = -config.friction * 0.001 * velocity;
      velocity += springForce + dampingForce;
      position += velocity;
    }
    this.value = position;
    this.velocity = velocity;
    if (
      Math.abs(velocity) < restVelocity &&
      Math.abs(this.target - position) < this.precision
    ) {
      this.value = this.target;
      this.velocity = 0;
      this.onChange(this.value);
      this.finish();
      return;
    }
    this.onChange(this.value);
  };
}

/** A looping linear (or eased) clock 0→1, paused/resumed by the caller. */
export class Loop {
  private stop: (() => void) | null = null;
  private start = 0;
  private offset = 0;
  constructor(
    private period: number,
    private onFrame: (v: number) => void,
    private easing: (t: number) => number = (t) => t,
  ) {}
  play() {
    if (this.stop) return;
    this.start = performance.now() - this.offset;
    this.stop = subscribe((time) => {
      const elapsed = time - this.start;
      this.offset = elapsed % this.period;
      this.onFrame(this.easing(this.offset / this.period));
    });
  }
  pause() {
    this.stop?.();
    this.stop = null;
  }
}

export const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
export const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
export const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
