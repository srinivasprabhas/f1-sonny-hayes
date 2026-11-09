import { DefaultLoadingManager } from "three";
import type Lenis from "lenis";
import { DEFAULT_PARAMS, HeroScene, fitSubjectToBox } from "../hero/scene";
import type { SceneTier } from "../hero/tier";
import { handover, resetHandover } from "../engine/motion";
import {
  CLEAR, ITEM, LABEL, PROGRESS_READY, PROGRESS_WAITING, SHEET, Spring, VEIL,
} from "../engine/spring";
import { subscribe } from "../engine/ticker";
import { loopInView } from "../engine/trigger";
import { reportAssetError } from "./errors";

const CLEAR_MS = 430;
const PAUSE_MS = 240;
const LIFT_TIMEOUT_MS = 3000;
const COVERED_AFTER = 1.15;

const webglAvailable = () => {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
};

/* ─────────────── The loading veil ─────────────── */

const initVeil = (hero: HTMLElement) => {
  const veil = hero.querySelector<HTMLElement>("[data-veil]")!;
  const content = veil.querySelector<HTMLElement>("[data-veil-content]")!;
  const fill = veil.querySelector<HTMLElement>("[data-veil-fill]")!;
  const meter = veil.querySelector<HTMLElement>("[data-veil-meter]")!;
  const meterFill = veil.querySelector<HTMLElement>("[data-veil-meter-fill]")!;
  const name = veil.querySelector<HTMLElement>("[data-veil-name]")!;

  // The route may be coming back from a hidden <Activity>: start from a fresh veil.
  veil.style.display = "";
  veil.style.opacity = "1";
  veil.style.pointerEvents = "auto";
  veil.setAttribute("aria-label", "Loading APXGP Racing Team");

  const progress = new Spring(0, PROGRESS_WAITING, (v) => {
    fill.style.transform = `scaleY(${v})`;
    meterFill.style.transform = `scaleX(${v})`;
  }, 0.001);
  progress.to(0.7);

  const nameIn = new Spring(0, LABEL, (p) => {
    name.style.opacity = String(p);
    name.style.transform = `translateY(${(1 - p) * 0.6}rem)`;
  }, 0.001);
  nameIn.to(1, { delay: 260 });

  const clear = new Spring(1, CLEAR, (p) => {
    content.style.opacity = String(p);
    content.style.transform = `translateY(${(1 - p) * -0.75}rem)`;
    meter.style.opacity = String(p);
  }, 0.001);
  const lift = new Spring(1, VEIL, (p) => {
    veil.style.opacity = String(p);
  }, 0.001);

  let readied = false;
  let removed = false;
  const remove = () => {
    if (removed) return;
    removed = true;
    stopPoll?.();
    veil.style.display = "none";
  };
  let stopPoll: (() => void) | null = null;

  const ready = (onLift: () => void) => {
    if (readied) return;
    readied = true;
    veil.style.pointerEvents = "none";
    veil.setAttribute("aria-label", "Loaded");
    progress.to(1, { config: PROGRESS_READY });
    clear.to(0);
    setTimeout(() => {
      lift.to(0);
      onLift();
      stopPoll = subscribe(() => {
        if (Number(getComputedStyle(veil).opacity) <= 0.004) remove();
      });
      setTimeout(remove, LIFT_TIMEOUT_MS);
    }, CLEAR_MS + PAUSE_MS);
  };

  return {
    ready,
    dispose: () => {
      [progress, nameIn, clear, lift].forEach((s) => s.dispose());
      stopPoll?.();
    },
  };
};

/* ─────────────── The scene wrapper ─────────────── */

const initScene = (hero: HTMLElement, onReady: () => void) => {
  const container = hero.querySelector<HTMLElement>("[data-hero-canvas]")!;
  const canvas = container.querySelector("canvas")!;
  const box = hero.querySelector<HTMLElement>("[data-hero-fit]")!;

  const fallback = () => {
    container.hidden = true;
    hero.querySelector<HTMLElement>("[data-hero-fallback]")!.hidden = false;
    hero.querySelector<HTMLElement>("[data-hero-fallback-figure]")!.hidden = false;
    onReady();
  };

  if (!webglAvailable()) {
    fallback();
    return { beginRise: () => {}, dispose: () => {} };
  }

  DefaultLoadingManager.onError = (url) => {
    reportAssetError(url);
    fallback();
  };

  let scene: HeroScene;
  try {
    scene = new HeroScene(canvas);
  } catch (error) {
    console.error(error);
    fallback();
    return { beginRise: () => {}, dispose: () => {} };
  }
  scene.onReady = onReady;
  let tier: SceneTier = scene.tier;

  const applyFit = () => {
    const s = hero.getBoundingClientRect();
    const fitted = box.offsetParent !== null;
    const b = box.getBoundingClientRect();
    scene.setParams({
      ...DEFAULT_PARAMS,
      ...(fitted
        ? fitSubjectToBox(DEFAULT_PARAMS, { top: b.top - s.top, height: b.height }, container.clientHeight)
        : null),
      ...(window.matchMedia("(max-width: 1023px)").matches ? { bgRevealOpacity: 0 } : null),
      ...(window.matchMedia("(hover: none)").matches ? { autoSweepAmount: 0.76 } : null),
      ...(window.matchMedia("(max-width: 639px)").matches
        ? { sweepRadius: 0.95, sweepWarp: 0.18, autoSweepAmount: 0.55 }
        : null),
      ...(scene.tier.reveal ? null : { autoSweepAmount: 0 }),
    });
  };

  const onPointer = (event: PointerEvent) =>
    scene.setPointer((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1);
  let bound = false;
  const bindPointer = () => {
    if (tier.pointerEnabled && !bound) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      bound = true;
    } else if (!tier.pointerEnabled && bound) {
      window.removeEventListener("pointermove", onPointer);
      bound = false;
    }
  };
  bindPointer();

  const coarseQuery = window.matchMedia("(hover: none) and (pointer: coarse)");
  let lastWidth = 0;
  let lastCoarse = coarseQuery.matches;
  let frame = 0;
  const onResize = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const width = container.clientWidth;
      const height = container.clientHeight;
      const coarse = coarseQuery.matches;
      const widthChanged = width !== lastWidth;
      const coarseChanged = coarse !== lastCoarse;
      if (!widthChanged && !coarseChanged && coarse && lastWidth) return;
      if ((widthChanged && lastWidth) || coarseChanged) {
        tier = scene.retune();
        bindPointer();
      }
      lastWidth = width;
      lastCoarse = coarse;
      scene.resize(width, height);
      applyFit();
    });
  };
  const ro = new ResizeObserver(onResize);
  ro.observe(container);
  coarseQuery.addEventListener("change", onResize);
  scene.resize(container.clientWidth, container.clientHeight);
  lastWidth = container.clientWidth;
  applyFit();

  const stopLoop = loopInView(
    hero,
    (time) => {
      if (document.hidden) return;
      if (window.scrollY > window.innerHeight * COVERED_AFTER) return;
      scene.update(time);
    },
    () => tier.frameInterval,
  );

  return {
    beginRise: () => scene.beginRise(),
    dispose: () => {
      stopLoop();
      ro.disconnect();
      coarseQuery.removeEventListener("change", onResize);
      if (bound) window.removeEventListener("pointermove", onPointer);
      cancelAnimationFrame(frame);
      scene.dispose();
    },
  };
};

/* ─────────────── The menu sheet ─────────────── */

export const initSheet = (root: ParentNode, lenis: Lenis | null) => {
  const burger = root.querySelector<HTMLButtonElement>("[data-burger]");
  const sheet = root.querySelector<HTMLElement>("[data-sheet]");
  if (!burger || !sheet) return () => {};
  const close = sheet.querySelector<HTMLButtonElement>("[data-sheet-close]")!;
  const logo = sheet.querySelector<HTMLElement>("[data-sheet-close-link]")!;
  const items = [...sheet.querySelectorAll<HTMLElement>("[data-sheet-item]")];
  let open = false;

  const fade = new Spring(0, SHEET, (p) => {
    sheet.style.opacity = String(p);
  }, 0.001);
  const rises = items.map(
    (item) =>
      new Spring(0, ITEM, (p) => {
        item.style.opacity = String(p);
        item.style.transform = `translateY(${(1 - p) * 0.75}rem)`;
      }, 0.001),
  );

  const show = () => {
    if (open) return;
    open = true;
    sheet.hidden = false;
    burger.setAttribute("aria-expanded", "true");
    lenis?.stop();
    document.documentElement.classList.add("menu-open");
    fade.to(1);
    rises.forEach((s, i) => s.to(1, { delay: 120 + i * 55 }));
    close.focus();
  };
  const hide = () => {
    if (!open) return;
    open = false;
    burger.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("menu-open");
    lenis?.start();
    rises.forEach((s) => s.to(0));
    fade.to(0, {
      onRest: () => {
        if (!open) sheet.hidden = true;
      },
    });
    burger.focus();
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.key === "Escape" && open) hide();
  };
  const wide = window.matchMedia("(min-width: 1280px)");
  const onWide = () => wide.matches && hide();
  const onLogo = (event: Event) => {
    event.preventDefault();
    hide();
  };

  burger.addEventListener("click", show);
  close.addEventListener("click", hide);
  logo.addEventListener("click", onLogo);
  window.addEventListener("keydown", onKey);
  wide.addEventListener("change", onWide);
  return () => {
    burger.removeEventListener("click", show);
    close.removeEventListener("click", hide);
    logo.removeEventListener("click", onLogo);
    window.removeEventListener("keydown", onKey);
    wide.removeEventListener("change", onWide);
    fade.dispose();
    rises.forEach((s) => s.dispose());
  };
};

export const initHero = (root: ParentNode) => {
  const hero = root.querySelector<HTMLElement>("[data-hero]");
  if (!hero) return () => {};
  resetHandover();
  const veil = initVeil(hero);
  let scene: ReturnType<typeof initScene> | undefined = undefined;
  const onReady = () =>
    veil.ready(() => {
      handover();
      scene?.beginRise();
    });
  scene = initScene(hero, onReady);
  const sceneRef = scene;
  return () => {
    veil.dispose();
    sceneRef.dispose();
  };
};
