/** A Sketchfab viewer, embedded the way Sketchfab publishes it, with its credit line. */
export function SketchfabEmbed({
  id,
  title,
  modelUrl,
  author,
  authorUrl,
}: {
  id: string;
  title: string;
  modelUrl: string;
  author: string;
  authorUrl: string;
}) {
  return (
    <figure className="sp-embed" data-m="rise" data-y="1.25rem" data-delay="150">
      <div className="sp-embed-frame">
        <iframe
          title={title}
          src={`https://sketchfab.com/models/${id}/embed?ui_theme=dark&dnt=1`}
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <figcaption className="sp-embed-credit">
        <a href={modelUrl} target="_blank" rel="nofollow noopener noreferrer">{title}</a> by{" "}
        <a href={authorUrl} target="_blank" rel="nofollow noopener noreferrer">{author}</a> on{" "}
        <a href="https://sketchfab.com" target="_blank" rel="nofollow noopener noreferrer">Sketchfab</a>
      </figcaption>
    </figure>
  );
}
