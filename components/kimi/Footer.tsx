/* eslint-disable @next/next/no-img-element */
import { ARROW_PATH, CTA_PATH, type } from "@/lib/kimi/footer/geometry";
import { Reveal } from "./Reveal";

const LINKS = [
  { label: "driver", href: "/driver" },
  { label: "season", href: "/season" },
  { label: "journal", href: "/journal" },
  { label: "next race", href: "/next-race" },
];

export function Footer() {
  return (
    <section className="footer" data-footer data-scope aria-labelledby="footer-title">
      <div className="ft-panel">
        <canvas className="contours" data-contours="--footer-contour" aria-hidden="true" />
      </div>

      <div className="ft-figure" aria-hidden="true">
        <div className="ft-figure-in" data-ft-figure>
          <img className="ft-figure-plate" src="/apex/footer/figure.png" alt="The APXGP cars 7 and 9" width={2000} height={1100} />
        </div>
      </div>

      <div
        className="ft-logo"
        role="img"
        aria-label="APXGP Racing Team"
        data-m="fade"
        data-delay="120"
        style={{ maskImage: "url(/apex/ui/apxgp-logo-mask-v2.png)", WebkitMaskImage: "url(/apex/ui/apxgp-logo-mask-v2.png)" }}
      />

      <h2 id="footer-title" className="ft-title">
        <span className="sr-only">keep pushing forward.</span>
        <Reveal text="keep pushing" className="line" stagger={110} delay={0} cfg="90,26" />
        <span className="line-wrap" aria-hidden="true">
          <Reveal text="forward" className="line" stagger={110} delay={130} cfg="90,26" />
          <span className="stop white" data-m="fade" data-delay={130 + 110}>
            .
          </span>
        </span>
      </h2>

      <nav className="ft-nav" aria-label="Footer">
        <ul>
          {LINKS.map((l, i) => (
            <li key={l.href}>
              <a href={l.href} className="ft-link">
                <Reveal text={l.label} split="letters" stagger={22} cfg="170,24" gap={0.2} delay={260 + i * 80} />
                <svg className="ft-link-arrow" viewBox="0 0 13.71 10.71" fill="none" aria-hidden="true">
                  <path d={ARROW_PATH} stroke="currentColor" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <p className="ft-copy" data-m="rise" data-y="0.75rem" data-delay="640" style={{ width: `max(${type(220)}, var(--foot-copy-min, 0px))`, fontSize: type(14) }}>
        © 2026 APXGP Racing Team. A fan site for the film F1.
      </p>

      <div className="ft-cta-wrap" data-m="rise" data-y="0.75rem" data-delay="720">
        <a href="/legal" className="ft-cta">
          <svg className="ft-cta-frame" viewBox="0 0 275 50" preserveAspectRatio="none" aria-hidden="true">
            <path d={CTA_PATH} className="cta-flood" />
            <path d={CTA_PATH} fill="none" stroke="var(--accent)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          </svg>
          <span className="ft-cta-label">
            legal documents
            <svg className="pd-cta-arrow" viewBox="0 0 13.71 10.71" fill="none" aria-hidden="true">
              <path d={ARROW_PATH} stroke="currentColor" />
            </svg>
          </span>
        </a>
      </div>

      <ul className="ft-socials" data-m="rise" data-y="0.75rem" data-delay="800" style={{ width: `max(${type(206)}, var(--social-min-w, 0px))`, fontSize: type(14) }}>
        <li><a className="link-dark" href="https://instagram.com">inst</a></li>
        <li><a className="link-dark" href="https://x.com">x</a></li>
        <li><a className="link-dark" href="https://youtube.com">youtube</a></li>
      </ul>
    </section>
  );
}
