import { Spring, REVEAL, type SpringConfig } from "./spring";

/**
 * The page's declarative motion: every `[data-m]` element and every
 * `[data-reveal]` text block is driven by springs from markup attributes.
 *
 *   data-m        rise | fade | scalex | scale-x-only
 *   data-y        translate distance for `rise` (e.g. "0.75rem")
 *   data-delay    ms before it starts (the `delayIn`)
 *   data-cfg      "tension,friction"
 *   data-mode     always | once | forward   (default forward)
 *   data-gate     hero | view               (default view)
 *   data-margin   rootMargin for the view gate
 *
 *   data-reveal   words | letters — children `.u` are the units
 *   data-stagger  ms between units
 */

type Mode = "always" | "once" | "forward";

const HANDOVER = "kimi:handover";
let handedOver = false;

/** Called when the home page mounts (again): the entrance waits for its veil. */
export const resetHandover = () => {
  handedOver = false;
};

export const handover = () => {
  handedOver = true;
  window.dispatchEvent(new Event(HANDOVER));
};

const parseCfg = (value: string | undefined, fallback: SpringConfig): SpringConfig => {
  if (!value) return fallback;
  const [tension, friction] = value.split(",").map(Number);
  return { tension, friction };
};

const parseLength = (value: string) => {
  const m = value.match(/^(-?[\d.]+)([a-z%]*)$/);
  return m ? { n: Number(m[1]), unit: m[2] } : { n: 0, unit: "px" };
};

/** Watches a gate and reports whether the motion should be at `to`. */
const gate = (
  element: HTMLElement,
  scope: HTMLElement,
  mode: Mode,
  onActive: (active: boolean) => void,
) => {
  const kind = element.dataset.gate ?? "view";
  if (kind === "hero") {
    if (handedOver) onActive(true);
    else {
      const on = () => onActive(true);
      window.addEventListener(HANDOVER, on, { once: true });
      return () => window.removeEventListener(HANDOVER, on);
    }
    return () => {};
  }
  let played = false;
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        played = true;
        onActive(true);
        if (mode === "once") io.disconnect();
        return;
      }
      if (!played || mode === "once") return;
      // forward: above the viewport top (scrolled past) holds `to`.
      const scrolledDown = entry.boundingClientRect.top <= 0;
      if (mode === "forward" && scrolledDown) return;
      onActive(false);
    },
    { rootMargin: element.dataset.margin ?? "0px" },
  );
  io.observe(scope);
  return () => io.disconnect();
};

const scopeOf = (element: HTMLElement) =>
  (element.dataset.scopeSelf !== undefined
    ? element
    : (element.closest("[data-scope]") as HTMLElement | null)) ?? element;

export const initMotion = (root: ParentNode) => {
  const cleanups: (() => void)[] = [];

  for (const element of root.querySelectorAll<HTMLElement>("[data-m]")) {
    const kind = element.dataset.m!;
    const delay = Number(element.dataset.delay ?? 0);
    const cfg = parseCfg(element.dataset.cfg, REVEAL);
    const mode = (element.dataset.mode ?? "forward") as Mode;
    const y = parseLength(element.dataset.y ?? "0px");
    const apply = (p: number) => {
      if (kind !== "scale-x-only") element.style.opacity = String(p);
      if (kind === "rise") {
        element.style.transform =
          p >= 1 ? "" : `translateY(${(1 - p) * y.n}${y.unit})`;
      } else if (kind === "scalex" || kind === "scale-x-only") {
        element.style.transform = `scaleX(${Math.max(0, p)})`;
      }
    };
    const spring = new Spring(0, cfg, apply, 0.001);
    cleanups.push(
      gate(element, scopeOf(element), mode, (active) =>
        spring.to(active ? 1 : 0, { delay: active ? delay : 0 }),
      ),
      () => spring.dispose(),
    );
  }

  for (const element of root.querySelectorAll<HTMLElement>("[data-reveal]")) {
    const letters = element.dataset.reveal === "letters";
    const stagger = Number(element.dataset.stagger ?? (letters ? 26 : 110));
    const delay = Number(element.dataset.delay ?? 0);
    const cfg = parseCfg(element.dataset.cfg, REVEAL);
    const mode = (element.dataset.mode ?? "forward") as Mode;
    const lift = letters ? 0.3 : 0.35;
    const units = [...element.querySelectorAll<HTMLElement>(".u")];
    const springs = units.map(
      (unit) =>
        new Spring(
          0,
          cfg,
          (p) => {
            unit.style.opacity = String(p);
            unit.style.transform = `translateY(${(1 - p) * lift}em)`;
          },
          0.001,
        ),
    );
    cleanups.push(
      gate(element, scopeOf(element), mode, (active) => {
        springs.forEach((s, i) =>
          s.to(active ? 1 : 0, { delay: active ? delay + i * stagger : 0 }),
        );
        element.dispatchEvent(new CustomEvent("reveal", { detail: active }));
      }),
      () => springs.forEach((s) => s.dispose()),
    );
  }

  return () => cleanups.forEach((fn) => fn());
};
