import { Loop, Spring, YEAR_SETTLE, easeOutQuad } from "../engine/spring";
import { inView, parallax, scrub } from "../engine/trigger";
import { px as timelinePx } from "../timeline/geometry";
import { px as paddockPx, PARALLAX_PORTRAIT } from "../paddock/geometry";
import { px as footerPx, PARALLAX_FIGURE } from "../footer/geometry";

const YEAR_RESTING = 0.4;
const YEAR_HOLD = 2200;
const PULSE_MS = 3200;
const PULSE_REACH = 3.4;
const CRAWL_MS = 5200;

/* ─────────────── From karts to F1 ─────────────── */

export const initTimeline = (root: ParentNode) => {
  const section = root.querySelector<HTMLElement>("[data-timeline]");
  if (!section) return () => {};
  const cleanups: (() => void)[] = [];
  const rowsBox = section.querySelector<HTMLElement>("[data-tl-rows]")!;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  for (const row of section.querySelectorAll<HTMLElement>("[data-row]")) {
    for (const layer of row.querySelectorAll<HTMLElement>("[data-par]")) {
      const travel = Number(layer.dataset.par);
      cleanups.push(parallax(row, layer, "top", timelinePx(travel), timelinePx(-travel)));
    }
    const slot = row.querySelector<HTMLElement>("[data-slot]")!;
    cleanups.push(parallax(row, slot, "top", "-10%", "0%", "top_bottom", "top_center"));

    if (row.dataset.frame === "centre") {
      const year = row.querySelector<HTMLElement>(".tl-year")!;
      const settle = new Spring(1, YEAR_SETTLE, (v) => (year.style.opacity = String(v)), 0.001);
      const reveal = year.querySelector<HTMLElement>("[data-reveal]")!;
      const onReveal = (event: Event) => {
        if ((event as CustomEvent<boolean>).detail) settle.to(YEAR_RESTING, { delay: YEAR_HOLD });
      };
      reveal.addEventListener("reveal", onReveal);
      cleanups.push(() => {
        reveal.removeEventListener("reveal", onReveal);
        settle.dispose();
      });
    }

    if (!reduced) {
      const plate = row.querySelector<HTMLElement>("[data-plate]")!;
      const enter = () => {
        rowsBox.classList.add("is-dimming");
        row.classList.add("is-hovered");
      };
      const leave = () => {
        rowsBox.classList.remove("is-dimming");
        row.classList.remove("is-hovered");
      };
      plate.addEventListener("pointerenter", enter);
      plate.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        plate.removeEventListener("pointerenter", enter);
        plate.removeEventListener("pointerleave", leave);
      });
    }
  }

  const rail = section.querySelector<HTMLElement>("[data-rail]")!;
  const rest = Number(rail.dataset.rest);
  const run = rail.querySelector<SVGRectElement>("[data-rail-run]")!;
  const mark = rail.querySelector<SVGRectElement>("[data-rail-mark]")!;
  cleanups.push(
    scrub(rail, {
      start: "top_center",
      end: "bottom_bottom",
      onInterpolated: (p) => {
        const value = Math.max(0, Math.min(1, p)) * rest;
        const scale = getComputedStyle(section).getPropertyValue("--mark-scale").trim() || "1";
        run.setAttribute("height", String(value));
        mark.setAttribute("transform", `translate(8 ${value}) rotate(${(value / rest) * 1800}) scale(${scale})`);
      },
    }),
  );
  return () => cleanups.forEach((fn) => fn());
};

/* ─────────────── From the paddock ─────────────── */

export const initPaddock = (root: ParentNode) => {
  const section = root.querySelector<HTMLElement>("[data-paddock]");
  if (!section) return () => {};
  const cleanups: (() => void)[] = [];
  const figure = section.querySelector<HTMLElement>("[data-pd-figure]")!;
  cleanups.push(parallax(section, figure, "top", "0cqw", paddockPx(-PARALLAX_PORTRAIT)));

  const links = [...section.querySelectorAll<HTMLElement>("[data-link]")];
  const period = (11.45 / 1440) * 100;
  const crawl = new Loop(CRAWL_MS, (v) => {
    for (const link of links) link.style.backgroundPositionX = `${Number(link.dataset.dir) * v * period}cqw`;
  });
  const pulse = section.querySelector<SVGCircleElement>("[data-pulse]");
  const pulser = new Loop(PULSE_MS, (v) => {
    pulse?.setAttribute("r", String(5.5 + v * 5.5 * PULSE_REACH));
    pulse?.setAttribute("opacity", String(0.5 * (1 - v) ** 2));
  }, easeOutQuad);
  cleanups.push(
    inView(section, (visible) => [crawl, pulser].forEach((l) => (visible ? l.play() : l.pause()))),
    () => [crawl, pulser].forEach((l) => l.pause()),
  );

  const strip = section.querySelector<HTMLElement>("[data-strip]")!;
  const live = section.querySelector<HTMLElement>("[data-live-card] .pd-card-text");
  if (live) {
    const on = () => strip.classList.add("is-live-hover");
    const off = () => strip.classList.remove("is-live-hover");
    live.addEventListener("pointerenter", on);
    live.addEventListener("pointerleave", off);
    cleanups.push(() => {
      live.removeEventListener("pointerenter", on);
      live.removeEventListener("pointerleave", off);
    });
  }
  return () => cleanups.forEach((fn) => fn());
};

/* ─────────────── Keep pushing forward ─────────────── */

export const initFooter = (root: ParentNode) => {
  const section = root.querySelector<HTMLElement>("[data-footer]");
  if (!section) return () => {};
  const figure = section.querySelector<HTMLElement>("[data-ft-figure]")!;
  return parallax(section, figure, "top", footerPx(PARALLAX_FIGURE), "0cqw", "top_bottom", "bottom_bottom");
};
