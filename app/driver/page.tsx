import type { Metadata } from "next";
import { DRIVER } from "@/lib/kimi/content";
import { BracketPanel, Chamfer, Copy, DarkBlock, DataRows, LightBlock, PageHead, Plate, SubPage } from "@/components/kimi/sub";

export const metadata: Metadata = { title: "Driver — APXGP Racing Team" };

const PATH = [
  { eyebrow: "1993 · lotus", title: "the prodigy", text: "A reckless young phenomenon from Reno, teammate to Rubén Cervantes at Team Lotus." },
  { eyebrow: "2003 · everything else", title: "racer for hire", text: "After the 1993 Spanish GP crash: Le Mans, NASCAR, the Dakar — and a stint as a New York taxi driver." },
  { eyebrow: "2023 · apxgp", title: "the comeback", text: "A Daytona class win, then Rubén's call. Car 7 ends the season with a win in Abu Dhabi." },
];

export default function Driver() {
  return (
    <SubPage>
      <PageHead
        current="/driver"
        eyebrow="apxgp racing team"
        lines={["the", "driver"]}
        intro="One driver, one number. APXGP follows car 7 from the race that ended it all to the grid he came back for."
        figure={{ src: "/apex/paddock/portrait-v2.png", alt: "Sonny Hayes in his APXGP race suit" }}
        aside={
          <BracketPanel eyebrow="on the roster">
            <dl className="sp-panel-body">
              <dt><strong>car {DRIVER.number}</strong></dt>
              <dd>{DRIVER.name}</dd>
              <dd>{DRIVER.team}</dd>
            </dl>
          </BracketPanel>
        }
      >
        <Chamfer href="/sonny-hayes" label="view profile" />
      </PageHead>

      <DarkBlock lines={["car", "07"]}>
        <div className="sp-split">
          <Plate src="/apex/plates/racer-cover.jpg" alt="RACER magazine cover: The Rising Stars of F1, Sonny Hayes and Rubén Cervantes" />
          <div className="sp-stack">
            <Copy text="Older than half the paddock's engineers and still faster than most of its drivers — Sonny races on instinct, and he races to win." delay={150} />
            <DataRows
              delay={250}
              rows={[
                { label: "Name", value: DRIVER.name },
                { label: "Car number", value: DRIVER.number, accent: true },
                { label: "Team", value: DRIVER.team },
                { label: "Born", value: DRIVER.born },
                { label: "Teammate", value: DRIVER.teammate },
              ]}
            />
            <Chamfer href="/sonny-hayes" label="view profile" variant="hollow" delay={500} />
          </div>
        </div>
      </DarkBlock>

      <LightBlock lines={["the", "path"]}>
        <div className="sp-cards">
          {PATH.map((step, i) => (
            <BracketPanel key={step.title} eyebrow={step.eyebrow} delay={i * 110}>
              <h3 className="sp-card-title" style={{ marginTop: "1.25rem" }}>{step.title}</h3>
              <p className="sp-card-copy" style={{ marginTop: "0.75rem" }}>{step.text}</p>
            </BracketPanel>
          ))}
        </div>
      </LightBlock>
    </SubPage>
  );
}
