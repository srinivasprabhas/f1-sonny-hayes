/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { PLATE_CLIP, PLATE_OUTLINE, PLATE_VIEW } from "@/lib/kimi/timeline/plate-shape";
import { ARROW_PATH } from "@/lib/kimi/paddock/geometry";
import { Brackets, Masthead, MenuSheet } from "./chrome";
import { Footer } from "./Footer";
import { Reveal } from "./Reveal";
import { Runtime } from "./Runtime";

/* ─────────────── Shell ─────────────── */

export function SubPage({ children }: { children: ReactNode }) {
  return (
    <div data-page>
      <svg width="0" height="0" aria-hidden="true" className="defs">
        <clipPath id="plate-clip" clipPathUnits="objectBoundingBox">
          <path d={PLATE_CLIP} />
        </clipPath>
      </svg>
      <main className="sp">
        {children}
        <Footer />
      </main>
      <MenuSheet />
      <Runtime />
    </div>
  );
}

/* ─────────────── Mastheads ─────────────── */

/** A block masthead: authored lines, word reveals at index·130, the stop last. */
export function Title({
  as: Tag = "h2",
  lines,
  stop = "white",
  className,
  id,
}: {
  as?: "h1" | "h2";
  lines: string[];
  stop?: "white" | "accent" | "black" | "none";
  className?: string;
  id?: string;
}) {
  const plain = lines.join(" ") + (stop === "none" ? "" : ".");
  return (
    <Tag className={`sp-title ${className ?? ""}`} id={id}>
      <span className="sr-only">{plain}</span>
      {lines.map((line, i) => {
        const last = i === lines.length - 1;
        const reveal = <Reveal text={line} className="line" stagger={110} delay={i * 130} cfg="90,26" />;
        if (!last || stop === "none") return <span key={line} aria-hidden="true">{reveal}</span>;
        return (
          <span key={line} className="line-wrap" aria-hidden="true">
            {reveal}
            <span className={`stop stop-${stop}`} data-m="fade" data-delay={i * 130 + 110}>
              .
            </span>
          </span>
        );
      })}
    </Tag>
  );
}

export function PageHead({
  current,
  eyebrow,
  lines,
  intro,
  children,
  aside,
  figure,
  stage,
}: {
  current?: string;
  eyebrow: string;
  lines: string[];
  intro?: string;
  children?: ReactNode;
  aside?: ReactNode;
  figure?: { src: string; alt: string; className?: string };
  /** Interactive media (a 3D viewer) given the head's right-hand column. */
  stage?: ReactNode;
}) {
  return (
    <section className="sp-head" data-scope>
      <canvas className="contours" data-contours="--paddock-contour" aria-hidden="true" />
      {figure && (
        <div className="sp-head-figure" aria-hidden={figure.alt ? undefined : true}>
          <div className="sp-par" data-sp-par="2rem">
            <img src={figure.src} alt={figure.alt} className={figure.className} crossOrigin="anonymous" />
          </div>
        </div>
      )}
      <div className="sp-head-inner">
        <Masthead current={current} />
        <div className="sp-head-body">
          <div className="sp-head-copy">
            <p className="sp-eyebrow" data-m="fade" data-delay="120">
              {eyebrow}
            </p>
            <Title as="h1" lines={lines} stop="accent" className="sp-title-xl" />
            {intro && (
              <Reveal as="p" text={intro} className="sp-lead" stagger={30} cfg="150,24" gap={0.22} delay={lines.length * 130 + 90} />
            )}
            {children && (
              <div className="sp-head-actions" data-m="rise" data-y="0.75rem" data-delay={lines.length * 130 + 260}>
                {children}
              </div>
            )}
          </div>
          {aside && (
            <div className="sp-head-aside" data-m="rise" data-y="1.25rem" data-delay="420">
              {aside}
            </div>
          )}
          {stage && <div className="sp-head-stage">{stage}</div>}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Blocks ─────────────── */

export function DarkBlock({
  lines,
  children,
  aside,
  className,
}: {
  lines?: string[];
  children: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`sp-block sp-dark ${className ?? ""}`} data-scope>
      <canvas className="dissolve sp-seam" data-dissolve="light" aria-hidden="true" />
      <div className="sp-block-inner">
        {(lines || aside) && (
          <div className="sp-block-head">
            {lines && <Title lines={lines} stop="white" className="sp-title-accent" />}
            {aside}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function LightBlock({
  lines,
  children,
  aside,
  className,
  seam = true,
}: {
  lines?: string[];
  children: ReactNode;
  aside?: ReactNode;
  className?: string;
  seam?: boolean;
}) {
  return (
    <section className={`sp-block sp-light ${className ?? ""}`} data-scope>
      <canvas className="contours" data-contours="--paddock-contour" aria-hidden="true" />
      {seam && <canvas className="dissolve sp-seam" data-dissolve="dark" aria-hidden="true" />}
      <div className="sp-block-inner">
        {(lines || aside) && (
          <div className="sp-block-head">
            {lines && <Title lines={lines} stop="accent" className="sp-title-ink" />}
            {aside}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/* ─────────────── Pieces ─────────────── */

export function BracketPanel({
  eyebrow,
  children,
  className,
  delay = 0,
  style,
}: {
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
}) {
  return (
    <div className={`bpanel sp-panel ${className ?? ""}`} data-m="rise" data-y="0.75rem" data-delay={delay} style={style}>
      <Brackets />
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      {children}
    </div>
  );
}

export function Figures({
  items,
  delay = 0,
  className,
}: {
  items: { label: string; value: string; accent?: boolean }[];
  delay?: number;
  className?: string;
}) {
  return (
    <dl className={`sp-figures ${className ?? ""}`}>
      {items.map((item, i) => (
        <div key={item.label} className="sp-figure" data-m="rise" data-y="0.75rem" data-delay={delay + i * 90}>
          <dt>{item.label}</dt>
          <Reveal
            as="dd"
            text={item.value}
            split="letters"
            stagger={24}
            cfg="200,24"
            delay={delay + i * 90 + 120}
            className={item.accent ? "is-accent" : undefined}
          />
        </div>
      ))}
    </dl>
  );
}

/** The chamfered button — `solid` is the paddock's dark slab, `hollow` the footer's outline. */
export function Chamfer({
  href,
  label,
  variant = "solid",
  delay,
}: {
  href: string;
  label: string;
  variant?: "solid" | "hollow";
  delay?: number;
}) {
  const path = "M0.5 0.5H216.5V42L209 49.5H0.5Z";
  return (
    <Link href={href} className={`sp-btn sp-btn-${variant}`} data-m={delay !== undefined ? "rise" : undefined} data-y="0.75rem" data-delay={delay}>
      <svg className="sp-btn-frame" viewBox="0 0 217 50" preserveAspectRatio="none" aria-hidden="true">
        {variant === "solid" && <path d={path} fill="var(--surface-black)" />}
        <path d={path} className="cta-flood" />
        <path d={path} fill="none" stroke="var(--accent)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="sp-btn-label">
        {label}
        <svg className="sp-btn-arrow" viewBox="0 0 13.71 10.71" fill="none" aria-hidden="true">
          <path d={ARROW_PATH} stroke="currentColor" />
        </svg>
      </span>
    </Link>
  );
}

/** The timeline's stepped-corner plate holding a photograph, with its overscan travel. */
export function Plate({
  src,
  alt,
  className,
  ratio = "710 / 462",
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  ratio?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`sp-plate ${className ?? ""}`} data-sp-plate style={{ aspectRatio: ratio }}>
      <div className="tl-fill">
        <div className="tl-slot" data-slot>
          <img src={src} alt={alt} loading="lazy" crossOrigin="anonymous" />
        </div>
      </div>
      <svg className="tl-outline" viewBox={`0 0 ${PLATE_VIEW.width} ${PLATE_VIEW.height}`} preserveAspectRatio="none" aria-hidden="true">
        <path d={PLATE_OUTLINE} fill="none" stroke="var(--timeline-outline)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      </svg>
      {children}
    </div>
  );
}

/** Hairline rows: label left, value right. */
export function DataRows({
  rows,
  delay = 0,
  tone = "dark",
}: {
  rows: { label: string; value: ReactNode; accent?: boolean }[];
  delay?: number;
  tone?: "dark" | "light";
}) {
  return (
    <dl className={`sp-rows sp-rows-${tone}`}>
      {rows.map((row, i) => (
        <div key={row.label} className="sp-row" data-m="rise" data-y="0.5rem" data-delay={delay + i * 70}>
          <dt>{row.label}</dt>
          <dd className={row.accent ? "is-accent" : undefined}>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A small uppercase run of copy, revealed word by word. */
export function Copy({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  return <Reveal as="p" text={text} className={`sp-copy ${className ?? ""}`} stagger={18} cfg="150,24" gap={0.22} delay={delay} />;
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="sp-textlink">
      <span aria-hidden="true">[ </span>
      {children}
      <span aria-hidden="true"> → ]</span>
    </Link>
  );
}
