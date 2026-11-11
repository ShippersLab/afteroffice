import { PRIVACY } from "../../content/privacy";
import { Section, type SectionHeadingProps } from "../layout/section";
import { Card } from "../ui/card";
import { IconBadge, type IconTone } from "../ui/icon";

const TONES: readonly IconTone[] = ["magenta", "cyan", "lilac", "cyan"];

export const PrivacySection = ({ heading }: SectionHeadingProps) => (
  <Section heading={heading} id="privacy" title={PRIVACY.title} lead={PRIVACY.lead}>
    <ul className="grid gap-4 sm:grid-cols-2">
      {PRIVACY.points.map((point, index) => (
        <li key={point.title}>
          <Card className="h-full">
            <div className="flex items-start gap-3">
              <IconBadge name={point.icon} tone={TONES[index] ?? "magenta"} />
              <div className="min-w-0">
                <h3 className="text-lg">{point.title}</h3>
                <p className="mt-1 text-sm text-muted">{point.body}</p>
              </div>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  </Section>
);
