import { Footer } from "@/components/kimi/Footer";
import { Hero } from "@/components/kimi/Hero";
import { MenuSheet } from "@/components/kimi/chrome";
import { Paddock } from "@/components/kimi/Paddock";
import { Runtime } from "@/components/kimi/Runtime";
import { Season } from "@/components/kimi/Season";
import { Timeline } from "@/components/kimi/Timeline";

export default function Home() {
  return (
    <div data-page>
      <main>
        <div className="stack">
          <div className="stack-layer stack-layer-0" data-stack-layer>
            <div className="stack-inner" data-stack-inner>
              <Hero />
            </div>
            <div className="stack-shade" data-stack-shade />
          </div>
          <div className="stack-layer stack-layer-1" data-stack-layer>
            <div className="stack-inner" data-stack-inner>
              <Season />
            </div>
            <div className="stack-shade" data-stack-shade />
          </div>
          <div className="stack-last">
            <Timeline />
          </div>
        </div>
        <Paddock />
        <Footer />
      </main>
      <MenuSheet />
      <Runtime />
    </div>
  );
}
