import type { Metadata } from "next";
import { NEXT_RACE } from "@/lib/kimi/content";
import { BracketPanel, Chamfer, Copy, DarkBlock, Figures, LightBlock, PageHead, Plate, SubPage } from "@/components/kimi/sub";

export const metadata: Metadata = { title: "Next race — APXGP Racing Team" };

/** Wikimedia Commons photographs, credited as their licences require. */
const CREDITS = [
  { what: "Trophy truck on the Malecón", who: "Andy Blackledge", licence: "CC BY 2.0", href: "https://commons.wikimedia.org/wiki/File:Baja_1000_on_Malecon.jpg" },
  { what: "Trophy truck jump", who: "Fvildosola", licence: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:70D-3941.jpg" },
  { what: "Trophy truck in the dust", who: "public domain", licence: "", href: "https://commons.wikimedia.org/wiki/File:Trophytruck.jpg" },
];

export default function NextRace() {
  return (
    <SubPage>
      <PageHead
        current="/next-race"
        eyebrow="next · off-road"
        lines={["baja", "1000"]}
        intro="After the Abu Dhabi win, Sonny left Formula 1 for the race he had been targeting all year."
        figure={{ src: "/apex/baja/truck.png", alt: "A Baja trophy truck", className: "sp-head-figure-wide" }}
        aside={
          <BracketPanel eyebrow="the race">
            <dl className="sp-panel-body">
              <dt><strong>{NEXT_RACE.name}</strong></dt>
              <dd>{NEXT_RACE.where}</dd>
              <dd>after the 2023 season</dd>
            </dl>
          </BracketPanel>
        }
      >
        <Chamfer href="/season" label="the 2023 season" />
      </PageHead>

      <DarkBlock lines={["not about", "the money"]}>
        <div className="sp-split">
          <Plate src="/apex/baja/jump.jpg" alt="A trophy truck airborne over a desert jump, spectators watching" />
          <div className="sp-stack">
            <Copy text="A thousand miles of desert, no grid, no pit wall. Sonny raced everything after 1993 — Le Mans, NASCAR, the Dakar — and Baja was always the one left on the list." delay={150} />
            <blockquote className="sp-quote" data-m="rise" data-y="0.75rem" data-delay="300">
              “We can’t pay much.” “Not about the money.”
              <cite>— F1</cite>
            </blockquote>
          </div>
        </div>
      </DarkBlock>

      <LightBlock lines={["the", "race"]}>
        <div className="sp-split">
          <Figures items={NEXT_RACE.facts} className="sp-figures-2" delay={150} />
          <Plate src="/apex/baja/dust.jpg" alt="A trophy truck kicking up dust on a desert track" />
        </div>
        <p className="sp-credits">
          Photos: {CREDITS.map((c, i) => (
            <span key={c.href}>
              <a href={c.href} target="_blank" rel="noopener noreferrer">{c.what}</a>
              {" — "}{c.who}{c.licence ? `, ${c.licence}` : ""}{i < CREDITS.length - 1 ? " · " : ""}
            </span>
          ))}. Wikimedia Commons.
        </p>
      </LightBlock>
    </SubPage>
  );
}
