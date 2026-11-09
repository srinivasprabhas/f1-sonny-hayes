import type { Metadata } from "next";
import { Chamfer, Copy, DarkBlock, PageHead, SubPage } from "@/components/kimi/sub";

export const metadata: Metadata = { title: "Trailer — APXGP Racing Team" };

const TRAILER_URL = "https://www.youtube.com/watch?v=69ffwl-8pCU";

export default function Trailer() {
  return (
    <SubPage>
      <PageHead eyebrow="f1 · official trailer" lines={["watch", "trailer"]} intro="Thirty years, one last shot, and car 7 back on the grid.">
        <Chamfer href="/sonny-hayes" label="view profile" />
      </PageHead>
      <DarkBlock>
        <figure className="sp-embed" data-m="rise" data-y="1.25rem" data-delay="100">
          <div className="sp-embed-frame">
            <iframe
              title="F1 — official trailer"
              src="https://www.youtube-nocookie.com/embed/69ffwl-8pCU"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </figure>
        <div style={{ marginTop: "2.5rem" }}>
          <Copy text="Prefer YouTube? The trailer opens there too." delay={250} />
          <a className="sp-textlink" href={TRAILER_URL} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "1rem" }}>
            [ open on youtube → ]
          </a>
        </div>
      </DarkBlock>
    </SubPage>
  );
}
