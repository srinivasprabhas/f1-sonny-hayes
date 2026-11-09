import type { Metadata } from "next";
import { DRIVER } from "@/lib/kimi/content";
import { SketchfabEmbed } from "@/components/kimi/Embed";
import { SketchfabViewer } from "@/components/kimi/SketchfabViewer";
import { BracketPanel, Chamfer, Copy, DarkBlock, DataRows, LightBlock, PageHead, Plate, SubPage } from "@/components/kimi/sub";

export const metadata: Metadata = { title: "Garage — APXGP Racing Team" };

export default function Garage() {
  return (
    <SubPage>
      <PageHead
        current="/garage"
        eyebrow="[ garage ]"
        lines={["the", "garage"]}
        intro="APX GP 07 — drag to orbit, scroll to zoom. The car that carried Sonny to his first Grand Prix win."
        stage={
          <SketchfabViewer
            id="412a32132fe5492380733a5682508f01"
            label="apx gp 07"
            title="F1 Movie APX GP 07 | www.vecarz.com"
            modelUrl="https://sketchfab.com/3d-models/f1-movie-apx-gp-07-wwwvecarzcom-412a32132fe5492380733a5682508f01"
            author="vecarz"
            authorUrl="https://sketchfab.com/heynic"
          />
        }
      >
        <Chamfer href="/sonny-hayes" label="view profile" />
      </PageHead>

      <DarkBlock lines={["apxgp", "07"]}>
        <div className="sp-split">
          <div className="sp-stack">
            <Copy text="Black and gold, car 7 — the APXGP that took Sonny from a stalled start at Silverstone to the top step in Abu Dhabi." delay={150} />
            <DataRows
              delay={250}
              rows={[
                { label: "Entrant", value: DRIVER.team },
                { label: "Chassis", value: "APXGP 04" },
                { label: "Power unit", value: "Mercedes 1.6 V6 t" },
                { label: "Sonny Hayes", value: "car 7", accent: true },
                { label: "Joshua Pearce", value: "car 9" },
              ]}
            />
          </div>
          <Plate src="/apex/plates/hungary.jpg" alt="The APXGP cars 7 and 9 on track" />
        </div>
      </DarkBlock>

      <LightBlock lines={["the", "helmet"]}>
        <div className="sp-split-wide">
          <SketchfabEmbed
            id="4134e7ae9b2b4dbda37d8255ca083033"
            title="SONNY HAYES HELMET EXPENSIFY APX GP TEAM"
            modelUrl="https://sketchfab.com/3d-models/sonny-hayes-helmet-expensify-apx-gp-team-4134e7ae9b2b4dbda37d8255ca083033"
            author="bad_bovy"
            authorUrl="https://sketchfab.com/bad_bovy"
          />
          <div className="sp-stack">
            <Copy text="Sonny's Expensify APXGP lid — designed by danielsimondesign, painted by Bell Racing Company." delay={150} />
            <DataRows
              tone="light"
              delay={250}
              rows={[
                { label: "Driver", value: DRIVER.name },
                { label: "Car number", value: DRIVER.number, accent: true },
                { label: "Team", value: DRIVER.team },
                { label: "Season", value: "2023" },
              ]}
            />
          </div>
        </div>
      </LightBlock>

      <DarkBlock lines={["the", "kit"]}>
        <div className="sp-split">
          <Plate src="/apex/plates/store.jpg" alt="APXGP cap and T-shirts" />
          <div className="sp-cards" style={{ gridTemplateColumns: "1fr" }}>
            {[
              { eyebrow: "race suit", text: "White and black, APXGP across the chest, and a US flag beside the name on the belt." },
              { eyebrow: "helmet", text: "The Expensify APXGP design, car 7 on the back." },
              { eyebrow: "team wear", text: "The APXGP black-and-gold collection, worn from the garage to the grid." },
            ].map((item, i) => (
              <BracketPanel key={item.eyebrow} eyebrow={item.eyebrow} delay={i * 110}>
                <p className="sp-card-copy" style={{ marginTop: "1rem" }}>{item.text}</p>
              </BracketPanel>
            ))}
          </div>
        </div>
      </DarkBlock>
    </SubPage>
  );
}
