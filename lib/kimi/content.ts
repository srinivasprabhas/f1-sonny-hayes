/**
 * Sonny Hayes and APXGP, from the film *F1* and its fan wikis:
 *   racing-cinematic-universe.fandom.com/wiki/Sonny_Hayes
 *   f1-the-movie.fandom.com/wiki/Sonny_Hayes
 * Results are the wikis' "Complete Formula One results" table.
 */

export const DRIVER = {
  id: "driver_07",
  name: "Sonny Hayes",
  nationality: "USA",
  born: "16 Mar 1969 · Reno, Nevada",
  team: "Expensify APXGP",
  season: "comeback season_2023",
  number: "7",
  teammate: "Joshua Pearce",
  owner: "Rubén Cervantes",
};

export const SEASON_FIGURES = [
  { label: "Championship", value: "13th", accent: true },
  { label: "Points", value: "43" },
  { label: "Wins", value: "1" },
  { label: "Car", value: "7" },
];

export type ResultCell = { round: string; result: string };
export type ResultYear = {
  year: string;
  entrant: string;
  chassis: string;
  engine: string;
  wdc: string;
  points: string;
  rounds: ResultCell[];
};

/** "" = not entered. */
export const F1_RESULTS: ResultYear[] = [
  {
    year: "1993", entrant: "Team Castrol Lotus", chassis: "Lotus 107B", engine: "Ford V8", wdc: "23rd", points: "1",
    rounds: ["RSA:Ret", "BRA:6", "EUR:8", "SMR:Ret", "ESP:Ret", "MON:", "CAN:", "FRA:", "GBR:", "GER:", "HUN:", "BEL:", "ITA:", "POR:", "JPN:", "AUS:"]
      .map((c) => { const [round, result] = c.split(":"); return { round, result }; }),
  },
  {
    year: "2023", entrant: "Expensify APXGP", chassis: "APXGP 04", engine: "Mercedes 1.6 V6 t", wdc: "13th", points: "43",
    rounds: ["BHR:", "SAU:", "AUS:", "AZE:", "MIA:", "MON:", "ESP:", "CAN:", "AUT:", "GBR:Ret", "HUN:22", "SAO:", "ITA:Ret", "NED:9", "SIN:", "JPN:7", "QAT:", "USA:", "MXC:5", "BEL:Ret", "LVS:Ret", "ABU:1"]
      .map((c) => { const [round, result] = c.split(":"); return { round, result }; }),
  },
];

export type Round = { round: string; name: string; date: string; result: string; state: "done" | "live" | "future" };

/** His 2023 starts, in order. */
export const ROUNDS: Round[] = [
  { round: "round 10", name: "british gp", date: "silverstone", result: "ret", state: "done" },
  { round: "round 11", name: "hungarian gp", date: "hungaroring", result: "p22", state: "done" },
  { round: "round 13", name: "italian gp", date: "monza", result: "ret", state: "done" },
  { round: "round 14", name: "dutch gp", date: "zandvoort", result: "p9", state: "done" },
  { round: "round 16", name: "japanese gp", date: "suzuka", result: "p7", state: "done" },
  { round: "round 19", name: "mexico city gp", date: "hermanos rodríguez", result: "p5", state: "done" },
  { round: "round 20", name: "belgian gp", date: "spa-francorchamps", result: "ret", state: "done" },
  { round: "round 21", name: "las vegas gp", date: "las vegas strip", result: "ret", state: "done" },
  { round: "round 22", name: "abu dhabi gp", date: "yas marina", result: "p1", state: "live" },
];

export const NEXT_RACE = {
  name: "baja 1000",
  where: "baja california · mexico",
  facts: [
    { label: "Distance", value: "1000 mi" },
    { label: "Terrain", value: "Desert" },
    { label: "Country", value: "Mexico" },
    { label: "Discipline", value: "Off-road" },
  ],
};

export type Story = {
  slug: string;
  round: string;
  date: string;
  title: string[];
  standfirst: string;
  image: string;
  imageAlt: string;
  figures: { label: string; value: string; accent?: boolean }[];
  body: { heading?: string; text: string }[];
  /** A line from the film, where one fits. */
  quote?: string;
};

export const STORIES: Story[] = [
  {
    slug: "abu-dhabi-gp",
    round: "round 22 · race report",
    date: "abu dhabi 2023",
    title: ["the", "win"],
    standfirst: "Thirty years after his first Grand Prix, Sonny Hayes wins in Abu Dhabi — the result that saves APXGP.",
    image: "/apex/plates/hungary.jpg",
    imageAlt: "The APXGP cars 7 and 9 on track",
    figures: [
      { label: "Result", value: "P1", accent: true },
      { label: "Points", value: "+25" },
      { label: "Championship", value: "13th" },
    ],
    body: [
      { text: "APXGP came to the final round needing a win, or the team would be sold. Rubén Cervantes had brought his old Lotus teammate back for exactly this." },
      { heading: "The race", text: "Sonny was ready to give the win to Joshua Pearce. Then Joshua and Lewis Hamilton collided, and the lead fell to car 7." },
      { heading: "The finish", text: "Sonny crossed the line first — his one Formula 1 victory, and the result that kept APXGP alive." },
      { heading: "What came next", text: "He retired from Formula 1 at the end of the season and went to the Baja 1000, the race he had been targeting all year." },
    ],
    quote: "Create your own breaks. Hope is not a strategy.",
  },
  {
    slug: "british-gp",
    round: "round 10",
    date: "silverstone 2023",
    title: ["a hard", "return"],
    standfirst: "Twenty-fourth in qualifying, a fake stall on the grid, and an afternoon that ended with both APXGP cars out.",
    image: "/apex/plates/hero.jpg",
    imageAlt: "Joshua Pearce and Sonny Hayes at Silverstone",
    figures: [
      { label: "Result", value: "Ret", accent: true },
      { label: "Qualified", value: "24th" },
      { label: "Started", value: "P20" },
    ],
    body: [
      { text: "Sonny qualified 24th; with two cars starting from the pits, he lined up 20th. Then he faked a stall — so he had to drive harder on the warm-up lap, and started on warmer tyres." },
      { heading: "The race", text: "He climbed to 14th before the advantage faded. A slow stop dropped him to 22nd, ahead only of his teammate. Told to give the place to Joshua, he refused — and both APXGP cars crashed out." },
    ],
    quote: "I don’t know when I’ll find it again, but, man, I want to. ’Cause in that moment, I’m flying.",
  },
  {
    slug: "hungarian-gp",
    round: "round 11",
    date: "hungaroring 2023",
    title: ["chaos", "theory"],
    standfirst: "Sonny keeps disrupting the order: safety cars, strategy calls and a garage still unsure what to make of its veteran.",
    image: "/apex/plates/buxton.jpg",
    imageAlt: "Sonny Hayes in his race suit in the pit tent",
    figures: [
      { label: "Result", value: "P22", accent: true },
      { label: "Round", value: "11" },
      { label: "Team", value: "APXGP" },
    ],
    body: [
      { text: "At the Hungaroring Sonny kept racing the way he always has — creating chaos and making it work for the team." },
      { heading: "The result", text: "Car 7 finished 22nd. The garage was split on his methods, but APXGP were finally in the fight." },
    ],
  },
  {
    slug: "italian-gp",
    round: "round 13",
    date: "monza 2023",
    title: ["through", "the fire"],
    standfirst: "Monza: APXGP ran its strongest race yet — until Joshua's crash, and Sonny pulling his teammate from the burning car.",
    image: "/apex/plates/feature.jpg",
    imageAlt: "Rubén Cervantes and Sonny Hayes at the circuit",
    figures: [
      { label: "Result", value: "Ret", accent: true },
      { label: "Round", value: "13" },
      { label: "Team", value: "APXGP" },
    ],
    body: [
      { text: "The Italian Grand Prix saw APXGP run better than ever. Then Joshua went into the barrier, and Sonny ran to the wreck and pulled him clear of the flames." },
      { heading: "After", text: "Reserve driver Luca Cortez filled in for Joshua while he recovered." },
    ],
  },
];
