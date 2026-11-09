/* eslint-disable @next/next/no-img-element */
import { asset } from "@/lib/kimi/assets";
import { Reveal } from "./Reveal";
import { Arrow, Brackets, Masthead } from "./chrome";

const ui = (file: string) => asset(`hero/ui/${file}`);

const CTA_BODY = "M220 42L212.932 50H0V0H220V42Z";

const META = [
  { icon: "/apex/ui/flag-usa.png", w: "1.125rem", h: "0.75rem", alt: "USA", label: "USA" },
  { icon: ui("icon-rookie.svg"), w: "1rem", h: "1rem", alt: "", label: "comeback season_2023" },
  { icon: "/apex/ui/apxgp-mark.png", w: "0.875rem", h: "0.875rem", alt: "", label: "APXGP F1 Team" },
];

const STATS = [
  { label: "Car", value: "7" },
  { label: "Wins", value: "1" },
  { label: "Points", value: "43" },
];

export function Hero() {
  return (
    <section data-hero className="hero" aria-labelledby="hero-name">
      <div className="hero-canvas" data-hero-canvas>
        <canvas className="size-full" aria-hidden="true" />
      </div>
      <div className="hero-fallback" data-hero-fallback hidden>
        <img src={ui("backdrop-lines.svg")} alt="" aria-hidden="true" className="hero-fallback-lines" />
      </div>
      <div className="hero-ramp" aria-hidden="true" />
      <div className="hero-figure-area" aria-hidden="true">
        <div className="hero-fit" data-hero-fit>
          <img
            data-hero-fallback-figure
            hidden
            src="/apex/hero/person-diffuse.jpg"
            alt=""
            crossOrigin="anonymous"
          />
        </div>
        <div className="hero-ramp-2" />
      </div>

      <div className="veil" data-veil role="status" aria-label="Loading APXGP Racing Team">
        <div className="veil-content" data-veil-content>
          <div className="veil-helmet" style={{ maskImage: `url(${ui("helmet-mask.png")})`, WebkitMaskImage: `url(${ui("helmet-mask.png")})` }}>
            <div className="veil-shell" />
            <div className="veil-fill" data-veil-fill />
          </div>
          <p className="veil-name" data-veil-name>
            sonny hayes
          </p>
        </div>
        <div className="veil-meter" data-veil-meter>
          <div className="veil-meter-fill" data-veil-meter-fill />
        </div>
      </div>

      <div className="hero-content">
        <Masthead gate="hero" />

        <div className="hero-middle">
          <div className="identity">
            <div className="identity-name">
              <Reveal
                as="h1"
                text="sonny hayes"
                className="hero-name"
                innerClassName="hero-name-inner"
                stagger={110}
                delay={180}
                mode="once"
                gate="hero"
                cfg="90,26"
              />
            </div>
            <ul className="meta">
              {META.map((m, i) => (
                <li key={m.label} data-m="rise" data-gate="hero" data-mode="once" data-y="0.75rem" data-delay={180 + 260 + i * 130}>
                  <img src={m.icon} alt={m.alt} style={{ width: m.w, height: m.h }} aria-hidden={m.alt ? undefined : true} />
                  <span>{m.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div data-hero-panels className="panels" data-m="rise" data-gate="hero" data-mode="once" data-y="1.25rem" data-delay="900">
            <div className="bpanel">
              <Brackets />
              <p className="eyebrow">next race</p>
              <div className="race-row">
                <dl className="race-list">
                  <dt>baja 1000</dt>
                  <dd>baja california</dd>
                  <dd>off-road · mexico</dd>
                </dl>
              </div>
            </div>
            <div className="bpanel">
              <Brackets />
              <p className="eyebrow">Season stats</p>
              <dl data-hero-stats className="stats">
                {STATS.map((s, i) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <Reveal as="dd" text={s.value} split="letters" stagger={26} cfg="200,24" delay={900 + i * 90} gate="hero" />
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <div className="actions" data-m="rise" data-gate="hero" data-mode="once" data-y="1.25rem" data-delay="1500">
          <a href="https://www.youtube.com/watch?v=69ffwl-8pCU" className="trailer" target="_blank" rel="noopener noreferrer">
            <img src={ui("play-button.svg")} alt="" aria-hidden="true" />
            <span className="trailer-lines">
              <span className="trailer-label">watch trailer</span>
              <span className="trailer-time">01:26</span>
            </span>
          </a>
          <a href="/sonny-hayes" className="cta">
            <svg className="cta-frame" viewBox="0 0 220 50" preserveAspectRatio="none" aria-hidden="true">
              <path d={CTA_BODY} fill="#0E0F14" />
              <path d={CTA_BODY} className="cta-flood" />
              <path d={CTA_BODY} fill="none" stroke="var(--accent)" strokeOpacity="0.25" vectorEffect="non-scaling-stroke" />
              <path d="M205 49.5H213L219.5 42V36M212 0.5H219.5V7M8 0.5H0.5V7M7.5 49.5H0.5V42.5" fill="none" stroke="var(--accent)" vectorEffect="non-scaling-stroke" />
            </svg>
            <span className="cta-label">view profile</span>
            <Arrow className="cta-arrow" />
          </a>
          <ul className="socials">
            <li><a className="link" href="https://instagram.com">inst</a></li>
            <li><a className="link" href="https://x.com">x</a></li>
            <li><a className="link" href="https://youtube.com">youtube</a></li>
          </ul>
        </div>
      </div>
    </section>
  );
}
