/* eslint-disable @next/next/no-img-element */
import { TIMELINE } from "@/lib/kimi/timeline/data";
import {
  COPY_LEFT, PARALLAX, PLATE_WIDTH, RAIL_DASH, RAIL_GAP, RAIL_SOLID, RAIL_START,
  RAIL_WIDTH, ROW_HEIGHT, px, railHeight, restingPoint,
} from "@/lib/kimi/timeline/geometry";
import { PLATE_CLIP, PLATE_OUTLINE, PLATE_VIEW } from "@/lib/kimi/timeline/plate-shape";
import { Reveal } from "./Reveal";

const VIEW_H = railHeight(TIMELINE) - RAIL_START;
const REST = restingPoint(TIMELINE) * VIEW_H;

export function Timeline() {
  return (
    <section className="timeline" data-timeline aria-labelledby="timeline-title">
      <canvas className="dissolve dissolve-timeline" data-dissolve="light" aria-hidden="true" />
      <svg width="0" height="0" aria-hidden="true" className="defs">
        <clipPath id="plate-clip" clipPathUnits="objectBoundingBox">
          <path d={PLATE_CLIP} />
        </clipPath>
      </svg>
      <div className="tl-wrap" data-scope>
        <div className="tl-rail" data-rail data-rest={REST} data-view-h={VIEW_H} aria-hidden="true">
          <svg viewBox={`0 0 ${RAIL_WIDTH} ${VIEW_H}`} overflow="visible" className="size-full">
            <line x1={8} x2={8} y1={0} y2={RAIL_SOLID} stroke="var(--timeline-rail)" strokeWidth={1} />
            <line x1={8} x2={8} y1={RAIL_SOLID + RAIL_GAP} y2={REST} stroke="var(--timeline-rail)" strokeWidth={1} strokeDasharray={`${RAIL_DASH} ${RAIL_DASH}`} />
            <rect data-rail-run x={7.5} width={1} y={0} height={0} fill="var(--foreground-on-dark)" />
            <rect data-rail-mark className="tl-mark" x={-4.5} y={-4.5} width={9} height={9} fill="var(--foreground-on-dark)" />
          </svg>
        </div>

        <h2 id="timeline-title" className="tl-title">
          <span className="sr-only">from karts to f1.</span>
          <Reveal text="from karts" className="line" stagger={110} delay={0} cfg="90,26" />
          <span className="line-wrap" aria-hidden="true">
            <Reveal text="to f1" className="line" stagger={110} delay={130} cfg="90,26" />
            <span className="stop" data-m="fade" data-delay={130 + 110}>
              .
            </span>
          </span>
        </h2>

        <div className="tl-rows" data-tl-rows>
          {TIMELINE.map((entry, index) => {
            const travel = PARALLAX.plate[entry.frame];
            const sideClass =
              entry.frame === "centre" ? "tl-plate-centre" : entry.align === "left" ? "tl-plate-left" : "tl-plate-right";
            return (
              <div
                key={entry.year}
                className={`tl-row tl-row-${entry.frame} ${index % 2 ? "tl-odd" : "tl-even"} ${entry.frame === "side" ? `tl-align-${entry.align}` : ""}`}
                data-row
                data-frame={entry.frame}
                data-scope
                style={{ ["--row-h" as string]: px(ROW_HEIGHT[entry.frame]) }}
              >
                <div className="tl-layer">
                  <div className="tl-layer-in" data-par={travel}>
                    <div className={`tl-plate ${sideClass}`} data-plate style={{ ["--plate-w" as string]: px(PLATE_WIDTH[entry.frame]) }}>
                      <div className="tl-fill">
                        <div className="tl-slot" data-slot>
                          <img src={entry.image} alt={entry.alt} width={1420} height={1016} loading="lazy" crossOrigin="anonymous" />
                        </div>
                      </div>
                      <svg className="tl-outline" viewBox={`0 0 ${PLATE_VIEW.width} ${PLATE_VIEW.height}`} preserveAspectRatio="none" aria-hidden="true">
                        <path d={PLATE_OUTLINE} fill="none" stroke="var(--timeline-outline)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="tl-layer tl-layer-year">
                  <div className="tl-layer-in" data-par={travel}>
                    <Reveal
                      as="p"
                      text={entry.year}
                      split="letters"
                      stagger={26}
                      cfg="190,24"
                      mode="once"
                      margin="0% 0% -25% 0%"
                      className="tl-year"
                      innerClassName="tl-year-inner"
                    />
                  </div>
                </div>
                {entry.lead && (
                  <div className="tl-layer tl-layer-copy">
                    <div className="tl-layer-in" data-par={PARALLAX.copy}>
                      <div
                        className="tl-copy"
                        style={{
                          left: px(COPY_LEFT),
                          width: `min(max(${px(entry.copyWidth!)}, var(--copy-min-w, 0px)), var(--copy-max-w, 100vw))`,
                        }}
                      >
                        <p data-m="rise" data-y="0.75rem" data-cfg="110,26" data-delay="220" data-mode="once" data-margin="0% 0% -25% 0%">
                          <strong>{entry.lead}</strong> {entry.body}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
