import {
  CORNER_MARKS, CORNER_MARK_SIZE, FLAG_CUT, FLAG_DIAMONDS, GRID_AXES_X, GRID_AXIS_Y,
  GRID_DASH, GRID_STROKE, HUB, LAP_CENTRELINE, LAP_LENGTH, LAP_MASK_WIDTH, MAP_VIEW,
  RINGS, TRACK_RIBBON, TURNS, TURN_POINTS,
} from "@/lib/kimi/season/map-vector";
import { Reveal } from "./Reveal";

const OVERRUN = 4000;

const PLATE_PATH = "M0.5 0.5H276.5V69L268 77.5H0.5Z";

const ROWS = [
  { dt: "P1", dd: "abu dhabi gp" },
  { dt: "13th", dd: "in the championship" },
  { dt: "43", dd: "points." },
];

export function Season() {
  return (
    <section data-season className="season" data-scope aria-labelledby="season-title">
      <div className="season-frame" data-season-frame aria-hidden="true">
        <div className="season-stage" data-season-stage>
          <div className="season-map">
            <canvas className="season-dots" data-season-dots />
            <svg viewBox={`0 0 ${MAP_VIEW.width} ${MAP_VIEW.height}`} overflow="visible" className="season-svg">
              <defs>
                <mask id="flag-cut" maskUnits="userSpaceOnUse" x={-OVERRUN} y={-OVERRUN} width={MAP_VIEW.width + OVERRUN * 2} height={MAP_VIEW.height + OVERRUN * 2}>
                  <rect x={-OVERRUN} y={-OVERRUN} width={MAP_VIEW.width + OVERRUN * 2} height={MAP_VIEW.height + OVERRUN * 2} fill="#fff" />
                  <rect
                    x={FLAG_CUT.x - FLAG_CUT.along / 2}
                    y={FLAG_CUT.y - FLAG_CUT.across / 2}
                    width={FLAG_CUT.along}
                    height={FLAG_CUT.across}
                    fill="#000"
                    transform={`rotate(${FLAG_CUT.angle} ${FLAG_CUT.x} ${FLAG_CUT.y})`}
                  />
                </mask>
                <mask id="lap-mask" maskUnits="userSpaceOnUse" x={0} y={0} width={MAP_VIEW.width} height={MAP_VIEW.height}>
                  <path
                    data-lap-mask
                    d={LAP_CENTRELINE}
                    fill="none"
                    stroke="#fff"
                    strokeWidth={LAP_MASK_WIDTH}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={LAP_LENGTH + 60}
                    strokeDashoffset={60 + LAP_LENGTH}
                  />
                </mask>
              </defs>
              <g id="grid">
                {GRID_AXES_X.map((x) => (
                  <line key={x} data-grid-line x1={x} x2={x} y1={-OVERRUN} y2={MAP_VIEW.height + OVERRUN} stroke="var(--map-grid)" strokeWidth={GRID_STROKE} strokeDasharray={GRID_DASH} />
                ))}
                <line data-grid-line x1={-OVERRUN} x2={MAP_VIEW.width + OVERRUN} y1={GRID_AXIS_Y} y2={GRID_AXIS_Y} stroke="var(--map-grid)" strokeWidth={GRID_STROKE} strokeDasharray={GRID_DASH} />
                {RINGS.map((ring) => (
                  <circle key={ring.r} cx={HUB.x} cy={HUB.y} r={ring.r} fill="none" stroke={ring.ghost ? "var(--map-grid-ghost)" : "var(--map-grid)"} strokeWidth={ring.width} />
                ))}
                <circle data-ping cx={HUB.x} cy={HUB.y} r={HUB.r} fill="none" stroke="var(--accent)" strokeWidth={2.13} opacity={0} />
                {CORNER_MARKS.map(([x, y]) => (
                  <rect key={`${x}-${y}`} x={x} y={y} width={CORNER_MARK_SIZE} height={CORNER_MARK_SIZE} fill="var(--map-mark)" />
                ))}
                <circle cx={HUB.x} cy={HUB.y} r={HUB.r} fill="var(--map-mark)" />
              </g>
              <g mask="url(#flag-cut)">
                <path d={TRACK_RIBBON} fill="var(--foreground-on-dark)" />
                <path d={TRACK_RIBBON} fill="var(--accent)" mask="url(#lap-mask)" />
              </g>
              <g id="markers">
                {TURNS.map((t) => (
                  <polygon key={t.x} points={TURN_POINTS} fill="var(--accent)" transform={`translate(${t.x} ${t.y}) rotate(${t.angle})`} />
                ))}
                <path d={FLAG_DIAMONDS} fill="var(--map-mark)" />
              </g>
            </svg>
          </div>
          <canvas className="season-trace" data-season-trace />
        </div>
      </div>

      <canvas className="dissolve dissolve-season" data-dissolve="light" aria-hidden="true" />

      <div className="season-copy">
        <div className="season-heading">
          <h2 id="season-title" className="season-title">
            <span className="sr-only">the season so far.</span>
            <Reveal text="the season" className="line" stagger={110} delay={0} cfg="90,26" />
            <span className="line-wrap" aria-hidden="true">
              <Reveal text="so far" className="line" stagger={110} delay={130} cfg="90,26" />
              <span className="stop" data-m="fade" data-delay={130 + 110}>
                .
              </span>
            </span>
          </h2>
          <div className="season-rule" data-m="scalex" data-delay={2 * 130} />
          <Reveal
            as="p"
            text="Thirty years after his first start, every race was a second chance. Here's how the comeback season went."
            className="season-intro"
            stagger={34}
            cfg="150,24"
            gap={0.22}
            delay={2 * 130 + 90}
          />
        </div>

        <div className="plate" data-m="rise" data-y="0.75rem" data-delay="260">
          <svg className="plate-frame" viewBox="0 0 277 78" preserveAspectRatio="none" aria-hidden="true">
            <path d={PLATE_PATH} fill="var(--surface-black)" stroke="var(--accent)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
            <line x1={83} x2={83} y1={0.5} y2={77.5} stroke="var(--accent)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="plate-badge">
            <svg className="globe" viewBox="0 0 37 23" fill="none" stroke="var(--accent)" strokeWidth={1} aria-hidden="true">
              <ellipse cx={18.5} cy={11.5} rx={18} ry={11} />
              <line x1={0.5} y1={11.5} x2={36.5} y2={11.5} />
              <ellipse data-meridian cx={18.5} cy={11.5} rx={18} ry={11} />
            </svg>
            <p className="plate-season">
              <Reveal text="F1" split="letters" stagger={22} cfg="210,24" delay={430} className="white" />
              <Reveal text="/ 2023" split="letters" stagger={22} cfg="210,24" delay={490} className="accent" />
            </p>
          </div>
          <dl className="plate-stats">
            {ROWS.map((row, i) => (
              <div key={row.dd}>
                <Reveal as="dt" text={row.dt} split="letters" stagger={22} cfg="210,24" delay={430 + i * 110} />
                <Reveal as="dd" text={row.dd} split="letters" stagger={22} cfg="210,24" delay={430 + i * 110 + 70} />
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
