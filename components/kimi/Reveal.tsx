import type { CSSProperties, ElementType, ReactNode } from "react";

/**
 * The text engine's markup. The plain string stays in a visually-hidden copy;
 * the animated units are aria-hidden inline-blocks that `initMotion` drives.
 */
export function Reveal({
  text,
  as: Tag = "span",
  split = "words",
  stagger,
  delay = 0,
  cfg,
  mode = "forward",
  gate,
  margin,
  gap,
  className,
  style,
  innerClassName,
  innerStyle,
  after,
}: {
  text: string;
  as?: ElementType;
  split?: "words" | "letters";
  stagger?: number;
  delay?: number;
  cfg?: string;
  mode?: "always" | "once" | "forward";
  gate?: "hero" | "view";
  margin?: string;
  gap?: number;
  className?: string;
  style?: CSSProperties;
  innerClassName?: string;
  innerStyle?: CSSProperties;
  after?: ReactNode;
}) {
  const words = text.split(" ").filter(Boolean);
  return (
    <Tag className={className} style={style}>
      <span className="sr-only">{text}</span>
      <span
        aria-hidden="true"
        className={`rv${innerClassName ? ` ${innerClassName}` : ""}`}
        data-reveal={split}
        data-stagger={stagger}
        data-delay={delay}
        data-cfg={cfg}
        data-mode={mode}
        data-gate={gate}
        data-margin={margin}
        style={{ columnGap: `${gap ?? 0.3}em`, ...innerStyle }}
      >
        {split === "words"
          ? words.map((word, i) => (
              <span className="u" key={i}>
                {word}
              </span>
            ))
          : words.map((word, i) => (
              <span className="w" key={i}>
                {[...word].map((letter, j) => (
                  <span className="u" key={j}>
                    {letter}
                  </span>
                ))}
              </span>
            ))}
        {after}
      </span>
    </Tag>
  );
}
