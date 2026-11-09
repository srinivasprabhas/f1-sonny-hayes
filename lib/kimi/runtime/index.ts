import Lenis from "lenis";
import { subscribe } from "../engine/ticker";
import { initMotion } from "../engine/motion";
import { initContours, initDissolves, initStack } from "./canvases";
import { initHero, initSheet } from "./hero";
import { initSubpage } from "./subpage";
import { initSeason } from "./season";
import { initFooter, initPaddock, initTimeline } from "./blocks";
import { watchImages } from "./errors";

/** Above 1920 the root keeps scaling: 16 · innerWidth / 1920. */
const initRootScale = () => {
  const apply = () => {
    document.documentElement.style.fontSize =
      window.innerWidth > 1920 ? `${(16 * window.innerWidth) / 1920}px` : "";
  };
  apply();
  window.addEventListener("resize", apply);
  return () => window.removeEventListener("resize", apply);
};

export const start = (root: ParentNode) => {
  history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  const cleanups: (() => void)[] = [];
  let lenis: Lenis | null = null;
  // Lenis runs from the shared loop and is registered first, so every scroll
  // reader on the page sees this frame's scrollY.
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    lenis = new Lenis({ smoothWheel: true });
    const instance = lenis;
    cleanups.push(subscribe((time) => instance.raf(time), () => 0), () => instance.destroy());
  }

  cleanups.push(
    initRootScale(),
    watchImages(root),
    initStack(root),
    initMotion(root),
    initSheet(root, lenis),
    initHero(root),
    initSubpage(root),
    initSeason(root),
    initDissolves(root),
    initContours(root),
    initTimeline(root),
    initPaddock(root),
    initFooter(root),
  );
  return () => cleanups.reverse().forEach((fn) => fn());
};
