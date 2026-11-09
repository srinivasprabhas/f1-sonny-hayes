/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export const NAV_LINKS = [
  { label: "Driver", href: "/driver" },
  { label: "SEASON", href: "/season" },
  { label: "journal", href: "/journal" },
  { label: "next race", href: "/next-race" },
];

const LOGO = "/apex/ui/apxgp-logo-v2.png";

const BRACKET = "M0 0.5H10V10.5";
const CORNERS = [
  { cls: "tr", transform: undefined },
  { cls: "tl", transform: "scaleX(-1)" },
  { cls: "bl", transform: "scale(-1)" },
  { cls: "br", transform: "scaleY(-1)" },
];

/** The hero's four corner strokes — one path drawn four ways. */
export function Brackets() {
  return (
    <>
      {CORNERS.map((c) => (
        <svg key={c.cls} aria-hidden="true" className={`bk bk-${c.cls}`} viewBox="0 0 10.5 10.5" fill="none" style={{ transform: c.transform }}>
          <path d={BRACKET} stroke="currentColor" />
        </svg>
      ))}
    </>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 13.7071 10.7071" fill="none">
      <path d="M0 5.35355H13M8 10.3536L13 5.35355L8 0.353553" stroke="currentColor" />
    </svg>
  );
}

/** The page masthead. On the home page it waits for the veil; elsewhere it rises on arrival. */
export function Masthead({ gate = "view", current }: { gate?: "hero" | "view"; current?: string }) {
  return (
    <header className="masthead" data-m="rise" data-gate={gate} data-mode="once" data-y="1.25rem" data-delay="0">
      <Link href="/" aria-label="APXGP Racing Team" className="masthead-logo">
        <img src={LOGO} alt="" width={548} height={120} />
      </Link>
      <nav aria-label="Primary" className="masthead-nav">
        <ul>
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={`link${current === l.href ? " is-current" : ""}`} aria-current={current === l.href ? "page" : undefined}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Link href="/garage" className={`link garage${current === "/garage" ? " is-current" : ""}`}>
        <span aria-hidden="true">[ </span>Garage<span aria-hidden="true"> → ]</span>
      </Link>
      <button type="button" className="burger" data-burger aria-label="Open menu" aria-expanded="false" aria-controls="menu-sheet">
        <span />
        <span />
      </button>
    </header>
  );
}

export function MenuSheet() {
  return (
    <div id="menu-sheet" className="sheet" data-sheet role="dialog" aria-modal="true" aria-label="Menu" hidden>
      <div className="sheet-top">
        <Link href="/" aria-label="APXGP Racing Team" data-sheet-close-link className="masthead-logo">
          <img src={LOGO} alt="" width={548} height={120} />
        </Link>
        <button type="button" className="sheet-close" data-sheet-close aria-label="Close menu">
          <span />
          <span />
        </button>
      </div>
      <nav className="sheet-nav" aria-label="Menu">
        <ul>
          {[...NAV_LINKS, { label: "Garage", href: "/garage" }].map((l) => (
            <li key={l.href} data-sheet-item>
              <Link href={l.href} className="link">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
