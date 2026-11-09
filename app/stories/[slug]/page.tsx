import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { STORIES } from "@/lib/kimi/content";
import { StoryCard } from "@/components/kimi/StoryCard";
import { DarkBlock, Figures, LightBlock, PageHead, Plate, SubPage, TextLink } from "@/components/kimi/sub";

/** Every story is prerendered from generateStaticParams; the route may block on params. */
export const instant = false;

export function generateStaticParams() {
  return STORIES.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: PageProps<"/stories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const story = STORIES.find((s) => s.slug === slug);
  return { title: story ? `${story.title.join(" ")} — APXGP Racing Team` : "Story" };
}

export default async function StoryPage({ params }: PageProps<"/stories/[slug]">) {
  const { slug } = await params;
  const story = STORIES.find((s) => s.slug === slug);
  if (!story) notFound();
  const others = STORIES.filter((s) => s.slug !== slug);

  return (
    <SubPage>
      <PageHead current="/journal" eyebrow={`${story.round} · ${story.date}`} lines={story.title} intro={story.standfirst}>
        <TextLink href="/journal">back to journal</TextLink>
      </PageHead>

      <DarkBlock>
        <div className="sp-split-wide">
          <article className="sp-article" data-m="rise" data-y="0.75rem" data-delay="150">
            {story.body.map((part, i) => (
              <div key={i} className="sp-stack" style={{ gap: "1rem" }}>
                {part.heading && <h3>{part.heading}</h3>}
                <p>{part.text}</p>
              </div>
            ))}
          </article>
          <div className="sp-stack">
            <Plate src={story.image} alt={story.imageAlt} />
            <Figures items={story.figures} className="is-three" delay={250} />
          </div>
        </div>
        {story.quote && (
          <blockquote className="sp-quote" style={{ marginTop: "6rem" }} data-m="rise" data-y="0.75rem" data-delay="100">
            “{story.quote}”
            <cite>— Sonny Hayes, F1</cite>
          </blockquote>
        )}
      </DarkBlock>

      <LightBlock lines={["more", "stories"]} aside={<TextLink href="/journal">all stories</TextLink>}>
        <div className="sp-cards">
          {others.map((s, i) => (
            <StoryCard key={s.slug} story={s} delay={i * 110} />
          ))}
        </div>
      </LightBlock>
    </SubPage>
  );
}
