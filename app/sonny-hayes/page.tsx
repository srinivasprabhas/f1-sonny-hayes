import type { Metadata } from "next";
import Link from "next/link";
import { DRIVER, SEASON_FIGURES, STORIES } from "@/lib/kimi/content";
import { TIMELINE } from "@/lib/kimi/timeline/data";
import { StoryCard } from "@/components/kimi/StoryCard";
import { BracketPanel, Chamfer, DarkBlock, DataRows, Figures, LightBlock, PageHead, Plate, SubPage, TextLink } from "@/components/kimi/sub";

export const metadata: Metadata = { title: "Sonny Hayes — APXGP Racing Team" };

export default function Profile() {
  return (
    <SubPage>
      <PageHead
        eyebrow="car 7 · apxgp"
        lines={["sonny", "hayes"]}
        intro="The greatest who never was. Thirty years after his crash, car 7 for APXGP — and a Grand Prix win at last."
        figure={{ src: "/apex/paddock/portrait-v2.png", alt: "Sonny Hayes in the paddock" }}
        aside={
          <BracketPanel eyebrow="profile">
            <dl className="sp-panel-body">
              <dt><strong>{DRIVER.team}</strong></dt>
              <dd>car no. {DRIVER.number}</dd>
              <dd>{DRIVER.born}</dd>
              <dd>{DRIVER.season}</dd>
            </dl>
          </BracketPanel>
        }
      >
        <Chamfer href="/season" label="season so far" />
        <a className="sp-textlink" href="https://www.youtube.com/watch?v=69ffwl-8pCU" target="_blank" rel="noopener noreferrer">[ watch trailer → ]</a>
      </PageHead>

      <DarkBlock lines={["the season", "so far"]} aside={<Chamfer href="/season" label="full season" variant="hollow" />}>
        <Figures items={SEASON_FIGURES} delay={200} />
      </DarkBlock>

      <LightBlock lines={["the road", "back"]} aside={<TextLink href="/journal">read the journal</TextLink>}>
        <div className="sp-cards">
          {TIMELINE.map((entry, i) => (
            <div key={entry.year} className="sp-card" data-m="rise" data-y="0.75rem" data-delay={i * 70}>
              <Plate src={entry.image} alt={entry.alt}>
                <span className="sp-plate-tag">{entry.year}</span>
              </Plate>
              {entry.lead ? (
                <p className="sp-card-copy"><strong>{entry.lead}</strong> {entry.body}</p>
              ) : (
                <p className="sp-card-copy">{entry.alt}.</p>
              )}
            </div>
          ))}
        </div>
      </LightBlock>

      <DarkBlock lines={["from the", "paddock"]} aside={<Link href="/journal" className="sp-textlink">[ all stories → ]</Link>}>
        <div className="sp-split">
          <StoryCard story={STORIES[0]} />
          <DataRows
            delay={200}
            rows={[
              { label: "Team", value: DRIVER.team },
              { label: "Car number", value: DRIVER.number, accent: true },
              { label: "Born", value: DRIVER.born },
              { label: "Teammate", value: `${DRIVER.teammate} · car 9` },
              { label: "Team owner", value: DRIVER.owner },
              { label: "F1 seasons", value: "1993 · 2023" },
              { label: "Lotus, 1993", value: "car 12" },
              { label: "Best result", value: "P1 · Abu Dhabi 2023", accent: true },
            ]}
          />
        </div>
      </DarkBlock>
    </SubPage>
  );
}
