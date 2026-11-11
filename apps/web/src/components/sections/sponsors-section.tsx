import { SITE } from "../../content/site";
import { SPONSORS } from "../../content/sponsors";
import { priceToBeat } from "../../utilities/price-to-beat";
import { Section, type SectionHeadingProps } from "../layout/section";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { IconBadge } from "../ui/icon";

export const SponsorsSection = ({ heading }: SectionHeadingProps) => (
  <Section heading={heading} id="sponsors" title={SPONSORS.title} lead={SPONSORS.lead}>
    <div className="flex flex-col gap-14">
      <div className="flex flex-col items-start gap-6">
        <Badge tone="amber">{SPONSORS.label}</Badge>
        <h2 className="text-2xl">{SPONSORS.rulesTitle}</h2>
        <ol className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SPONSORS.rules.map((rule, index) => (
            <li key={rule.title}>
              <Card className="h-full">
                <div className="flex items-start gap-3">
                  <IconBadge name={rule.icon} tone="amber" />
                  <div className="min-w-0">
                    <span className="font-mono text-xs text-muted" aria-hidden="true">
                      0{index + 1}
                    </span>
                    <h3 className="text-lg">{rule.title}</h3>
                    <p className="mt-1 text-sm text-muted">{rule.body}</p>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ol>
      </div>
      <div className="flex flex-col items-start gap-6 border-t border-line/60 pt-12">
        <div>
          <h2 className="text-2xl">{SPONSORS.boardTitle}</h2>
          <p className="mt-3 max-w-[52ch] text-sm text-muted">{SPONSORS.boardLead}</p>
        </div>
        <ul className="grid w-full gap-3">
          {SPONSORS.board.map((placement) => (
            <li key={placement.name}>
              <Card className="grid gap-4 p-5 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] sm:items-center">
                <div className="flex min-w-0 items-center gap-3">
                  <IconBadge name={placement.icon} tone="amber" />
                  <div className="min-w-0">
                    <h3 className="text-lg">{placement.name}</h3>
                    <p className="text-sm text-muted">{placement.detail}</p>
                  </div>
                </div>
                <dl className="flex items-baseline justify-between gap-3 sm:block">
                  <dt className="font-mono text-xs text-muted">Holder</dt>
                  <dd
                    className={
                      placement.holder ? "text-base font-semibold" : "text-base text-muted"
                    }
                  >
                    {placement.holder ?? SPONSORS.holderOpen}
                  </dd>
                </dl>
                <dl className="flex items-baseline justify-between gap-3 sm:block">
                  <dt className="font-mono text-xs text-muted">Price to beat</dt>
                  <dd className="text-base font-semibold text-amber">
                    {priceToBeat(placement, SPONSORS.minimumRaise)} USD per week
                  </dd>
                </dl>
              </Card>
            </li>
          ))}
        </ul>
        <p className="max-w-[52ch] text-sm text-muted">{SPONSORS.note}</p>
        <Button href={`mailto:${SITE.sponsorsEmail}`} variant="sponsor">
          {SPONSORS.cta}: {SITE.sponsorsEmail}
        </Button>
      </div>
    </div>
  </Section>
);
