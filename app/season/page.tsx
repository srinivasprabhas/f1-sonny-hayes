import type { Metadata } from "next";
import { F1_RESULTS, ROUNDS, SEASON_FIGURES } from "@/lib/kimi/content";
import { BracketPanel, Chamfer, Copy, DarkBlock, Figures, LightBlock, PageHead, SubPage } from "@/components/kimi/sub";

export const metadata: Metadata = { title: "Season — APXGP Racing Team" };

const tone = (result: string) =>
  result === "" ? "is-empty" : result === "1" ? "is-win" : result === "Ret" ? "is-ret" : Number(result) <= 10 ? "is-points" : "is-finish";

export default function Season() {
  return (
    <SubPage>
      <PageHead
        current="/season"
        eyebrow="f1 / 2023"
        lines={["the season", "so far"]}
        intro="Thirty years after his first start, every race was a second chance. Here's how the comeback season went."
        aside={
          <BracketPanel eyebrow="final standings">
            <dl className="sp-panel-body">
              <dt><strong>13th in the championship</strong></dt>
              <dd>43 points</dd>
              <dd>1 win · abu dhabi</dd>
            </dl>
          </BracketPanel>
        }
      >
        <Chamfer href="/stories/abu-dhabi-gp" label="the win" />
      </PageHead>

      <DarkBlock lines={["the", "starts"]}>
        <ol className="sp-rounds">
          {ROUNDS.map((r, i) => (
            <li key={r.round} className={`sp-round ${r.state === "live" ? "is-live" : ""}`} data-m="rise" data-y="0.5rem" data-delay={i * 70}>
              <span className="sp-round-no">{r.round}</span>
              <span className="sp-round-name">{r.name}</span>
              <span className="sp-round-date">{r.date}</span>
              <span className="sp-round-result">
                {r.state === "live" && <span className="sp-live-dot" aria-hidden="true" />}
                {r.result}
              </span>
            </li>
          ))}
        </ol>
      </DarkBlock>

      <LightBlock lines={["complete", "results"]}>
        <div className="sp-stack" style={{ gap: "3.5rem" }}>
          {F1_RESULTS.map((year, y) => (
            <section key={year.year} className="sp-results" data-m="rise" data-y="0.75rem" data-delay={y * 120} aria-label={`${year.year} Formula One results`}>
              <header className="sp-results-head">
                <span className="sp-results-year">{year.year}</span>
                <span>{year.entrant}</span>
                <span>{year.chassis} · {year.engine}</span>
                <span className="sp-results-total">{year.wdc} · {year.points} pts</span>
              </header>
              <ol className="sp-results-grid">
                {year.rounds.map((cell, i) => (
                  <li key={`${cell.round}-${i}`} className={tone(cell.result)}>
                    <span>{cell.round}</span>
                    <strong>{cell.result || "—"}</strong>
                  </li>
                ))}
              </ol>
            </section>
          ))}
          <Copy className="sp-copy-sm" text="Source: the F1 film's fan wikis. Ret = retired. Highlighted: points finishes and the win." delay={300} />
        </div>
      </LightBlock>

      <DarkBlock lines={["the", "numbers"]}>
        <Figures items={SEASON_FIGURES} delay={150} />
      </DarkBlock>
    </SubPage>
  );
}
