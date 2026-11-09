export interface TimelineEntry {
  year: string;
  frame: "centre" | "side";
  align?: "left" | "right";
  lead?: string;
  body?: string;
  copyWidth?: number;
  image: string;
  alt: string;
}

/**
 * Sonny Hayes' career, from the F1 film and its fan wikis
 * (racing-cinematic-universe.fandom.com, f1-the-movie.fandom.com).
 */
export const TIMELINE: readonly TimelineEntry[] = [
  { year: "1969", frame: "centre", lead: "Born in Reno.", body: "Son of a USAC Championship car mechanic, Sonny lost his father young and climbed the formula ladder on raw speed.", copyWidth: 228, image: "/apex/plates/racer-cover.jpg", alt: "RACER magazine cover: The Rising Stars of F1, Sonny Hayes and Rubén Cervantes with the Lotus" },
  { year: "1993", frame: "side", align: "right", image: "/apex/plates/lotus-cockpit.jpg", alt: "A young Sonny Hayes climbing into his Lotus" },
  { year: "spain", frame: "centre", lead: "The crash.", body: "A vicious accident at the 1993 Spanish Grand Prix: C5 neck fracture, spinal contusion. The greatest who never was.", copyWidth: 272, image: "/apex/plates/wide.jpg", alt: "An empty grid at dawn" },
  { year: "2003", frame: "side", align: "left", image: "/apex/plates/fpjk.jpg", alt: "Sonny Hayes and Kate talking in a pub" },
  { year: "2023", frame: "centre", lead: "Daytona.", body: "A decade of Le Mans, NASCAR, Dakar and New York taxis — then a GTD class win at the 24 Hours of Daytona with Chip Hart Racing.", copyWidth: 278, image: "/apex/plates/buxton.jpg", alt: "Sonny Hayes in his race suit in the pit tent" },
  { year: "apxgp", frame: "side", align: "right", image: "/apex/plates/hero.jpg", alt: "Joshua Pearce and Sonny Hayes at Silverstone" },
  { year: "abu dhabi", frame: "centre", lead: "The win.", body: "Thirty years after his first start, car 7 crosses the line first at the 2023 Abu Dhabi Grand Prix. APXGP is saved.", copyWidth: 284, image: "/apex/plates/hungary.jpg", alt: "The APXGP cars 7 and 9 on track" },
];
