/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { CSSProperties } from "react";
import { asset } from "@/lib/kimi/assets";
import { ARROW_PATH, BRACKET_PATH, CALENDAR, CTA_PATH, px, type } from "@/lib/kimi/paddock/geometry";
import { Reveal } from "./Reveal";

const U = (n: number) => `calc(var(--panel-u, calc(100cqw / 1440)) * ${n})`;
const spread = (x: number) => `calc(50% + ${px(x - 720)} * var(--cal-spread, 1))`;

const CORNERS = [
  { key: "tl", rotate: 270 },
  { key: "tr", rotate: 0 },
  { key: "br", rotate: 90 },
  { key: "bl", rotate: 180 },
] as const;

/**
 * Four corner strokes of one path. `left/right/top/bottom` are the frame's
 * edges; each corner is pushed outward by `--bracket-spread` and the bottom
 * pair moved alone by `--bracket-stretch`.
 */
function Frame({
  left, right, top, bottom, size, className, style, attrs,
}: {
  left: string; right: string; top: string; bottom: string; size: string;
  className?: string; style?: CSSProperties; attrs?: Record<string, string | number>;
}) {
  const s = "var(--bracket-spread, 0px)";
  const stretch = "var(--bracket-stretch, 0px)";
  const pos = {
    tl: { left: `calc(${left} - ${s})`, top: `calc(${top} - ${s})` },
    tr: { left: `calc(${right} - ${size} + ${s})`, top: `calc(${top} - ${s})` },
    br: { left: `calc(${right} - ${size} + ${s})`, top: `calc(${bottom} - ${size} + ${s} + ${stretch})` },
    bl: { left: `calc(${left} - ${s})`, top: `calc(${bottom} - ${size} + ${s} + ${stretch})` },
  };
  return (
    <div className={`pd-frame ${className ?? ""}`} style={style} aria-hidden="true" {...attrs}>
      {CORNERS.map((c) => (
        <svg key={c.key} className="pd-corner" viewBox="0 0 10.5 10.5" fill="none" style={{ ...pos[c.key], width: size, height: size, transform: `rotate(${c.rotate}deg)` }}>
          <path d={BRACKET_PATH} stroke="currentColor" />
        </svg>
      ))}
    </div>
  );
}

const STATS = [
  { icon: "icon-flag.svg", label: "last result", value: "P1" },
  { icon: "icon-bars.svg", label: "points gained", value: "+25" },
  { icon: "icon-trophy.svg", label: "championship", value: "13th" },
  { icon: "icon-gauge.svg", label: "points", value: "43" },
];

const CARDS = [
  { round: "round 20", name: "belgian gp", date: "spa", x: 347, w: 100, marker: "ret" },
  { round: "round 21", name: "las vegas gp", date: "las vegas", x: 511, w: 100, marker: "ret" },
  { round: "round 22", name: "abu dhabi gp", date: "p1 · win", x: 675, w: 100, marker: "live" },
  { round: "next", name: "baja 1000", date: "off-road", x: 839, w: 114, marker: "ring" },
  { round: "2023", name: "13th", date: "43 points", x: 1017, w: 76, marker: "ring" },
] as const;
const LIVE_INDEX = 2;
const CARD_DELAY = 560;
const CARD_STAGGER = 90;

const COLUMN_RIGHT = `calc(2.2222cqw + ${U(12)})`;
const COLUMN_LEFT = `calc(100% - ${COLUMN_RIGHT} - ${U(193)})`;
const FRAME_RIGHT = "calc(100% - 2.2222cqw)";
const FRAME_LEFT = `calc(${FRAME_RIGHT} - ${U(193)} - ${U(25)})`;

export function Paddock() {
  return (
    <section className="paddock" data-paddock data-scope aria-labelledby="paddock-title">
      <canvas className="contours" data-contours="--paddock-contour" aria-hidden="true" />
      <div className="pd-band" aria-hidden="true" />
      <div className="pd-figure-layer">
        <div className="pd-figure-in" data-pd-figure>
          <img className="pd-portrait" src="/apex/paddock/portrait-v2.png" alt="Sonny Hayes in the paddock" width={1350} height={1165} crossOrigin="anonymous" />
        </div>
      </div>
      <div className="pd-melt" aria-hidden="true" />
      <canvas className="dissolve dissolve-paddock" data-dissolve="dark" aria-hidden="true" />

      <h2 id="paddock-title" className="pd-title">
        <span className="sr-only">from the paddock.</span>
        <Reveal text="from the" className="line" stagger={110} delay={0} cfg="90,26" />
        <span className="line-wrap" aria-hidden="true">
          <Reveal text="paddock" className="line" stagger={110} delay={130} cfg="90,26" />
          <span className="stop accent" data-m="fade" data-delay={130 + 110}>
            .
          </span>
        </span>
      </h2>

      <div className="pd-intro">
        <Reveal
          as="p"
          className="pd-report"
          text="Thirty years after his first Grand Prix, Sonny Hayes wins in Abu Dhabi — the result that saves APXGP."
          stagger={30}
          cfg="150,24"
          gap={0.22}
          delay={2 * 130 + 90}
        />
        <div data-m="rise" data-y="0.75rem" data-delay={2 * 130 + 260} className="pd-cta-wrap">
          <Link href="/stories/abu-dhabi-gp" className="pd-cta">
            <svg className="pd-cta-frame" viewBox="0 0 217 50" preserveAspectRatio="none" aria-hidden="true">
              <path d={CTA_PATH} fill="var(--surface-black)" />
              <path d={CTA_PATH} className="cta-flood" />
              <path d={CTA_PATH} fill="none" stroke="var(--accent)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
            </svg>
            <span className="pd-cta-label">
              read story
              <svg className="pd-cta-arrow" viewBox="0 0 13.71 10.71" fill="none" aria-hidden="true">
                <path d={ARROW_PATH} stroke="currentColor" />
              </svg>
            </span>
          </Link>
        </div>
      </div>

      <div className="pd-panels">
        <div data-m="fade" data-delay="320">
          <Frame
            left={`var(--meet-frame-left, ${FRAME_LEFT})`}
            right={`var(--meet-frame-right, ${FRAME_RIGHT})`}
            top={`var(--meet-frame-top, ${U(32)})`}
            bottom={`var(--meet-frame-bottom, ${U(105)})`}
            size={U(10)}
          />
        </div>
        <div
          className="pd-meet"
          data-m="rise"
          data-y="0.75rem"
          data-delay="410"
          style={{ left: `var(--meet-left, ${COLUMN_LEFT})`, top: `var(--meet-top, ${U(43)})`, width: U(193), gap: U(6), fontSize: U(14) }}
        >
          <strong>abu dhabi gp</strong>
          <span>yas marina</span>
          <span>round 22 · 2023</span>
        </div>

        <div data-m="fade" data-delay="460" style={{ ["--bracket-stretch" as string]: "var(--stats-stretch, 0px)" }}>
          <Frame
            left={`var(--stats-frame-left, ${FRAME_LEFT})`}
            right={`var(--stats-frame-right, ${FRAME_RIGHT})`}
            top={`calc(${U(137)} + var(--stats-frame-drop, 0px))`}
            bottom={`calc(${U(535)} + var(--stats-frame-drop, 0px))`}
            size={U(10)}
          />
        </div>
        <div
          className="pd-stats"
          style={{ left: `var(--stats-left, calc(100% - ${COLUMN_RIGHT} - ${U(193)}))`, top: `calc(${U(147)} + var(--stats-drop, 0px))`, width: `var(--stats-col-w, ${U(193)})` }}
        >
          {STATS.map((s, i) => (
            <div key={s.label} className="pd-stat-wrap">
              {i > 0 && (
                <div
                  className="pd-rule"
                  data-m="scale-x-only"
                  data-delay={460 + i * 90}
                  style={{ margin: `var(--stats-rule-top, ${U(24)}) 0 var(--stats-rule-bottom, ${U(23)})` }}
                />
              )}
              <div className="pd-stat" data-m="rise" data-y="0.75rem" data-delay={460 + i * 90 + 40} style={{ height: `max(${U(58)}, var(--stats-row-min, 0px))`, gap: U(24) }}>
                <span
                  aria-hidden="true"
                  className="pd-stat-icon"
                  style={{
                    width: U(31),
                    height: U(31),
                    maskImage: `url(${asset(`paddock/${s.icon}`)})`,
                    WebkitMaskImage: `url(${asset(`paddock/${s.icon}`)})`,
                  }}
                />
                <div className="pd-stat-text">
                  <span className="pd-stat-label" style={{ fontSize: U(12), letterSpacing: U(-0.48) }}>
                    {s.label}
                  </span>
                  <Reveal
                    text={s.value}
                    split="letters"
                    stagger={24}
                    cfg="200,24"
                    delay={460 + i * 90 + 120}
                    className="pd-stat-value"
                    style={{ fontSize: U(38), letterSpacing: U(-3.04) }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pd-strip" data-strip data-scope>
        {CALENDAR.links.map((link, i) => (
          <div
            key={link.x}
            className="pd-link"
            data-link
            data-dir={link.x < CARDS[LIVE_INDEX].x ? 1 : -1}
            data-m="scale-x-only"
            data-delay={CARD_DELAY + i * CARD_STAGGER}
            data-margin="0% 0% -20% 0%"
            style={{
              left: spread(link.x),
              width: `calc(${px(link.width)} * var(--cal-spread, 1))`,
              top: `calc(${px(CALENDAR.linkY)} + var(--cal-mark-drop, 0px))`,
              backgroundImage: `repeating-linear-gradient(to right, var(--foreground-on-dark-muted) 0 ${px(7)}, transparent ${px(7)} ${px(11.45)})`,
            }}
          />
        ))}
        <ol className="pd-cards">
          {CARDS.map((card, i) => {
            const live = i === LIVE_INDEX;
            const delay = CARD_DELAY + i * CARD_STAGGER;
            return (
              <li
                key={card.round}
                className={`pd-card ${live ? "is-live" : ""} ${i < 2 ? "pd-card-early" : ""}`}
                data-live-card={live ? "" : undefined}
                style={{ ["--card-left" as string]: `calc(${spread(card.x + card.w / 2)} - ${px(card.w / 2)})`, ["--card-w" as string]: px(card.w) }}
              >
                <div className="pd-card-text" data-m="rise" data-y="0.5rem" data-delay={delay} data-margin="0% 0% -20% 0%">
                  <span className="pd-round" style={{ fontSize: type(12), letterSpacing: px(-0.24) }}>
                    {card.round}
                  </span>
                  <span className="pd-name" data-m="rise" data-y="0.3em" data-cfg="190,24" data-delay={delay + 110} data-margin="0% 0% -20% 0%">
                    {card.name}
                  </span>
                  <span className="pd-date" style={{ fontSize: type(14), letterSpacing: px(-0.28) }}>
                    {card.date}
                  </span>
                </div>
                <div
                  className="pd-marker"
                  data-m="fade"
                  data-delay={delay + 60}
                  data-margin="0% 0% -20% 0%"
                  style={{ left: `calc(${spread(card.x + card.w / 2)})`, top: `calc(${px(CALENDAR.markY)} + var(--cal-mark-drop, 0px))` }}
                >
                  {card.marker === "live" ? (
                    <svg viewBox="0 0 11 11" overflow="visible" style={{ width: px(11), height: px(11) }}>
                      <circle data-pulse cx={5.5} cy={5.5} r={5.5} fill="none" stroke="var(--accent)" strokeWidth={1} vectorEffect="non-scaling-stroke" className="pd-pulse" />
                      <circle cx={5.5} cy={5.5} r={5.5} fill="var(--accent)" />
                    </svg>
                  ) : card.marker === "ring" ? (
                    <svg viewBox="0 0 11 11" style={{ width: px(11), height: px(11) }}>
                      <circle cx={5.5} cy={5.5} r={5} fill="none" stroke="#fff" strokeWidth={1} vectorEffect="non-scaling-stroke" />
                    </svg>
                  ) : (
                    <span className="pd-result" style={{ fontSize: type(12) }}>
                      {card.marker}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
        <div className="pd-live-frame" data-m="fade" data-delay={CARD_DELAY + 5 * CARD_STAGGER} data-margin="0% 0% -20% 0%">
          <Frame
            left={spread(CALENDAR.live.left)}
            right={spread(CALENDAR.live.right)}
            top={`calc(${px(CALENDAR.live.top)} + var(--bracket-drop, 0px))`}
            bottom={`calc(${px(CALENDAR.live.bottom)} + var(--bracket-drop, 0px))`}
            size={px(10)}
            className="accent"
          />
        </div>
      </div>
    </section>
  );
}
