import Link from "next/link";
import type { Story } from "@/lib/kimi/content";
import { Plate } from "./sub";

export function StoryCard({ story, delay = 0 }: { story: Story; delay?: number }) {
  return (
    <Link href={`/stories/${story.slug}`} className="sp-card" data-m="rise" data-y="0.75rem" data-delay={delay}>
      <Plate src={story.image} alt={story.imageAlt} />
      <div className="sp-card-meta">
        <span>{story.round}</span>
        <time>{story.date}</time>
      </div>
      <h3 className="sp-card-title">{story.title.join(" ")}</h3>
      <p className="sp-card-copy">{story.standfirst}</p>
    </Link>
  );
}
