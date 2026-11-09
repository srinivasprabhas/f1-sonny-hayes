"use client";

import { useEffect, useRef } from "react";
import { asset } from "@/lib/kimi/assets";
import { CLEAR, PROGRESS_READY, PROGRESS_WAITING, LABEL, Spring, VEIL } from "@/lib/kimi/engine/spring";

/**
 * A Sketchfab model that starts on its own, behind the home page's loading
 * veil: the helmet silhouette fills from the top and the 4px meter runs along
 * the foot, both reading one progress spring. Progress creeps on the soft
 * spring until Sketchfab reports real load progress, completes on the stiff one
 * at `viewerready`, then the veil clears and lifts in the same three beats.
 */

const API_SRC = "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js";
const CLEAR_MS = 430;
const PAUSE_MS = 240;
/** Lift anyway if the viewer never reports ready (blocked script, slow network). */
const GIVE_UP_MS = 25000;

type SketchfabApi = {
  start: (cb?: () => void) => void;
  addEventListener: (event: string, cb: (value?: unknown) => void) => void;
};
type SketchfabClient = {
  init: (
    uid: string,
    options: Record<string, unknown> & { success: (api: SketchfabApi) => void; error: () => void },
  ) => void;
};
declare global {
  interface Window {
    Sketchfab?: new (iframe: HTMLIFrameElement) => SketchfabClient;
  }
}

let apiLoading: Promise<void> | null = null;
const loadApi = () => {
  if (window.Sketchfab) return Promise.resolve();
  apiLoading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = API_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Sketchfab viewer API failed to load"));
    document.head.appendChild(script);
  });
  return apiLoading;
};

export function SketchfabViewer({
  id,
  title,
  label,
  modelUrl,
  author,
  authorUrl,
}: {
  id: string;
  title: string;
  /** The name the veil shows while the model loads. */
  label: string;
  modelUrl: string;
  author: string;
  authorUrl: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const meterRef = useRef<HTMLDivElement>(null);
  const meterFillRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current!;
    const veil = veilRef.current!;
    const content = contentRef.current!;
    const fill = fillRef.current!;
    const meter = meterRef.current!;
    const meterFill = meterFillRef.current!;
    const name = nameRef.current!;
    let disposed = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    veil.style.display = "";
    veil.style.opacity = "1";

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

    let ready = false;
    const finish = () => {
      if (ready || disposed) return;
      ready = true;
      veil.setAttribute("aria-label", `${title} loaded`);
      progress.to(1, { config: PROGRESS_READY });
      clear.to(0);
      timers.push(
        setTimeout(() => {
          lift.to(0, {
            onRest: () => {
              veil.style.display = "none";
            },
          });
        }, CLEAR_MS + PAUSE_MS),
      );
    };

    // Real progress, when Sketchfab reports it, moves the meter past the creep.
    const report = (value: unknown) => {
      const p = typeof value === "object" && value && "progress" in value ? Number((value as { progress: number }).progress) : NaN;
      if (Number.isFinite(p) && !ready) progress.to(Math.max(progress.target, Math.min(0.95, p)));
    };

    const fallback = () => {
      // The API could not load: fall back to the plain autostarting embed.
      if (disposed) return;
      iframe.src = `https://sketchfab.com/models/${id}/embed?autostart=1&preload=1&ui_theme=dark&dnt=1`;
      iframe.addEventListener("load", () => timers.push(setTimeout(finish, 1500)), { once: true });
    };

    loadApi()
      .then(() => {
        if (disposed || !window.Sketchfab) return;
        const client = new window.Sketchfab(iframe);
        client.init(id, {
          autostart: 1,
          preload: 1,
          ui_theme: "dark",
          ui_hint: 0,
          dnt: 1,
          success: (api) => {
            api.start();
            api.addEventListener("modelLoadProgress", report);
            api.addEventListener("viewerready", finish);
          },
          error: fallback,
        });
      })
      .catch(fallback);

    timers.push(setTimeout(finish, GIVE_UP_MS));

    return () => {
      disposed = true;
      timers.forEach(clearTimeout);
      [progress, nameIn, clear, lift].forEach((s) => s.dispose());
    };
  }, [id, title]);

  const mask = `url(${asset("hero/ui/helmet-mask.png")})`;
  return (
    <figure className="sp-embed">
      <div className="sp-embed-frame">
        <iframe ref={iframeRef} title={title} allow="autoplay; fullscreen; xr-spatial-tracking" allowFullScreen />
        <div ref={veilRef} className="sp-veil" role="status" aria-label={`Loading ${title}`}>
          <div ref={contentRef} className="veil-content">
            <div className="veil-helmet" style={{ maskImage: mask, WebkitMaskImage: mask }}>
              <div className="veil-shell" />
              <div ref={fillRef} className="veil-fill" />
            </div>
            <p ref={nameRef} className="veil-name">
              {label}
            </p>
          </div>
          <div ref={meterRef} className="veil-meter">
            <div ref={meterFillRef} className="veil-meter-fill" />
          </div>
        </div>
      </div>
      <figcaption className="sp-embed-credit">
        <a href={modelUrl} target="_blank" rel="nofollow noopener noreferrer">{title}</a> by{" "}
        <a href={authorUrl} target="_blank" rel="nofollow noopener noreferrer">{author}</a> on{" "}
        <a href="https://sketchfab.com" target="_blank" rel="nofollow noopener noreferrer">Sketchfab</a>
      </figcaption>
    </figure>
  );
}
