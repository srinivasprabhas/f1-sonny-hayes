import { parallax } from "../engine/trigger";
import { subscribe } from "../engine/ticker";

/**
 * Behaviour the inner pages add on top of the shared engine: the plates'
 * overscanned photographs riding their own crossing, generic parallax
 * layers, and the next-race countdown.
 */
export const initSubpage = (root: ParentNode) => {
  const cleanups: (() => void)[] = [];

  for (const plate of root.querySelectorAll<HTMLElement>("[data-sp-plate]")) {
    const slot = plate.querySelector<HTMLElement>("[data-slot]");
    if (slot) cleanups.push(parallax(plate, slot, "top", "-10%", "0%", "top_bottom", "top_center"));
  }

  for (const layer of root.querySelectorAll<HTMLElement>("[data-sp-par]")) {
    const travel = layer.dataset.spPar ?? "3rem";
    const trigger = (layer.closest("section") as HTMLElement | null) ?? layer;
    cleanups.push(parallax(trigger, layer, "top", travel, `-${travel}`));
  }

  for (const clock of root.querySelectorAll<HTMLElement>("[data-countdown]")) {
    const target = Date.parse(clock.dataset.countdown!);
    const cells = {
      d: clock.querySelector<HTMLElement>("[data-cd='d']"),
      h: clock.querySelector<HTMLElement>("[data-cd='h']"),
      m: clock.querySelector<HTMLElement>("[data-cd='m']"),
      s: clock.querySelector<HTMLElement>("[data-cd='s']"),
    };
    const pad = (n: number) => String(n).padStart(2, "0");
    let last = "";
    const tick = () => {
      const left = Math.max(0, target - Date.now());
      const d = Math.floor(left / 86400000);
      const h = Math.floor(left / 3600000) % 24;
      const m = Math.floor(left / 60000) % 60;
      const s = Math.floor(left / 1000) % 60;
      const key = `${d}:${h}:${m}:${s}`;
      if (key === last) return;
      last = key;
      if (cells.d) cells.d.textContent = pad(d);
      if (cells.h) cells.h.textContent = pad(h);
      if (cells.m) cells.m.textContent = pad(m);
      if (cells.s) cells.s.textContent = pad(s);
      clock.toggleAttribute("data-finished", left === 0);
      const status = clock.parentElement?.querySelector<HTMLElement>("[data-cd-status]");
      if (status && left === 0) status.textContent = "the race weekend is complete — read the reports in the journal.";
    };
    tick();
    cleanups.push(subscribe(tick, () => 250));
  }

  return () => cleanups.forEach((fn) => fn());
};
