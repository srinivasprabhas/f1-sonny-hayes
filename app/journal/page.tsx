import type { Metadata } from "next";
import { STORIES } from "@/lib/kimi/content";
import { StoryCard } from "@/components/kimi/StoryCard";
import { Chamfer, DarkBlock, PageHead, SubPage } from "@/components/kimi/sub";

export const metadata: Metadata = { title: "Journal — APXGP Racing Team" };

export default function Journal() {
  return (
    <SubPage>
      <PageHead
        current="/journal"
        eyebrow="race reports & stories"
        lines={["the", "journal"]}
        intro="Every weekend, told from the paddock: the laps, the decisions and the people around car 7."
      >
        <Chamfer href={`/stories/${STORIES[0].slug}`} label="latest story" />
      </PageHead>
      <DarkBlock lines={["latest", "stories"]}>
        <div className="sp-cards">
          {STORIES.map((story, i) => (
            <StoryCard key={story.slug} story={story} delay={i * 110} />
          ))}
        </div>
      </DarkBlock>
    </SubPage>
  );
}
