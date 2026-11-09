import type { Metadata } from "next";
import { DarkBlock, PageHead, SubPage } from "@/components/kimi/sub";

export const metadata: Metadata = { title: "Legal documents — APXGP Racing Team" };

const DOCS = [
  {
    id: "terms",
    title: "terms of use",
    text: "By using this site you agree to use it for personal, non-commercial purposes. All content — text, photography, artwork and marks — belongs to its respective owners. This is a non-commercial fan site for the film F1; APXGP, its characters and its imagery belong to the film's producers.",
  },
  {
    id: "privacy",
    title: "privacy policy",
    text: "We collect only what the site needs to work: anonymous usage data to keep pages fast, and the details you choose to give us if you contact us. We never sell personal data. You can ask us to see, correct or delete what we hold at any time.",
  },
  {
    id: "cookies",
    title: "cookie policy",
    text: "Essential cookies keep the site running. Analytics cookies are only set with your consent, and you can withdraw that consent whenever you like from your browser settings.",
  },
  {
    id: "imprint",
    title: "imprint",
    text: "APXGP Racing Team is the fictional team from the film F1. Film stills and artwork are the property of their copyright holders; team names, logos and liveries belong to their respective owners.",
  },
];

export default function Legal() {
  return (
    <SubPage>
      <PageHead eyebrow="apxgp racing team" lines={["legal", "documents"]} intro="The small print, kept plain: how this site works and what we do with your data." />
      <DarkBlock>
        <div className="sp-split-wide">
          <div className="sp-legal">
            {DOCS.map((doc, i) => (
              <section key={doc.id} id={doc.id} data-m="rise" data-y="0.75rem" data-delay={i * 90}>
                <h3>{doc.title}</h3>
                <p>{doc.text}</p>
              </section>
            ))}
          </div>
          <nav className="sp-toc" aria-label="Documents">
            <p className="eyebrow">documents</p>
            {DOCS.map((doc) => (
              <a key={doc.id} href={`#${doc.id}`}>{doc.title}</a>
            ))}
          </nav>
        </div>
      </DarkBlock>
    </SubPage>
  );
}
