import sponsorsData from "./sponsors.json";

export type SponsorPlacement = {
  readonly name: string;
  readonly href: string;
};

type SponsorEntry = { placement: string; name: string; href: string };

type SponsorsData = {
  readonly contactPath: string;
  readonly placements: readonly SponsorEntry[];
};

const data = sponsorsData as SponsorsData;

const byPlacement = new Map<string, SponsorPlacement>(
  data.placements.map((entry) => [entry.placement, { name: entry.name, href: entry.href }]),
);

export function sponsorFor(placement: string): SponsorPlacement {
  return byPlacement.get(placement) ?? { name: "", href: data.contactPath };
}
