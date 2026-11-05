import { SITE } from "../../content/site";
import { SPONSORS } from "../../content/sponsors";
import { Section, type SectionHeadingProps } from "../layout/section";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { PixelFrame } from "../ui/pixel-frame";

export const SponsorsSection = ({ heading }: SectionHeadingProps) => (
  <Section
    heading={heading}
    id="sponsors"
    title={SPONSORS.title}
    lead={SPONSORS.lead}
    titleClassName="text-amber"
  >
    <div className="flex flex-col items-start gap-6">
      <Badge tone="amber">{SPONSORS.label}</Badge>
      <ul className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SPONSORS.placements.map((placement) => (
          <li key={placement.name}>
            <PixelFrame className="h-full" tone="amber">
              <h3 className="text-xl text-amber">{placement.name}</h3>
              <p className="mt-2 text-muted">{placement.detail}</p>
            </PixelFrame>
          </li>
        ))}
      </ul>
      <p className="max-w-[60ch] text-muted">{SPONSORS.note}</p>
      <Button href={`mailto:${SITE.sponsorsEmail}`} variant="sponsor">
        {SPONSORS.cta}: {SITE.sponsorsEmail}
      </Button>
    </div>
  </Section>
);
