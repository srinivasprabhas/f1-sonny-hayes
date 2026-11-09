/**
 * One rAF loop, reference counted. A subscriber is called only when
 * `time - last > getFramerate()` — 0 runs every tick.
 */
type Subscriber = {
  callback: (time: number) => void;
  getFramerate: () => number;
  last: number;
};

const subscribers = new Set<Subscriber>();
let frame = 0;

const loop = (time: number) => {
  frame = requestAnimationFrame(loop);
  for (const sub of [...subscribers]) {
    if (!subscribers.has(sub)) continue;
    if (time - sub.last > sub.getFramerate()) {
      sub.last = time;
      sub.callback(time);
    }
  }
};

export const subscribe = (
  callback: (time: number) => void,
  getFramerate: () => number = () => 0,
) => {
  const sub: Subscriber = { callback, getFramerate, last: -Infinity };
  subscribers.add(sub);
  if (!frame) frame = requestAnimationFrame(loop);
  return () => {
    subscribers.delete(sub);
    if (!subscribers.size && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
};
