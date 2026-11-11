import { SITE } from "../../content/site";
import { SPONSORS } from "../../content/sponsors";
import { Section, type SectionHeadingProps } from "../layout/section";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { IconBadge } from "../ui/icon";

export const SponsorsSection = ({ heading }: SectionHeadingProps) => (
  <Section heading={heading} id="sponsors" title={SPONSORS.title} lead={SPONSORS.lead}>
    <div className="flex flex-col items-start gap-6">
      <Badge tone="amber">{SPONSORS.label}</Badge>
      <ul className="grid w-full gap-4 sm:grid-cols-2">
        {SPONSORS.placements.map((placement) => (
          <li key={placement.name}>
            <Card className="h-full">
              <div className="flex items-start gap-3">
                <IconBadge name={placement.icon} tone="amber" />
                <div className="min-w-0">
                  <h3 className="text-lg">{placement.name}</h3>
                  <p className="mt-1 text-sm text-muted">{placement.detail}</p>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>
      <p className="max-w-[52ch] text-sm text-muted">{SPONSORS.note}</p>
      <Button href={`mailto:${SITE.sponsorsEmail}`} variant="sponsor">
        {SPONSORS.cta}: {SITE.sponsorsEmail}
      </Button>
    </div>
  </Section>
);
