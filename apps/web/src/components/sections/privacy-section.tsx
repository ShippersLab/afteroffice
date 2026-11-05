import { PRIVACY } from "../../content/privacy";
import { Section, type SectionHeadingProps } from "../layout/section";
import { Card } from "../ui/card";

export const PrivacySection = ({ heading }: SectionHeadingProps) => (
  <Section heading={heading} id="privacy" title={PRIVACY.title} lead={PRIVACY.lead}>
    <ul className="grid gap-4 sm:grid-cols-2">
      {PRIVACY.points.map((point) => (
        <li key={point.title}>
          <Card className="h-full">
            <h3 className="text-lg">{point.title}</h3>
            <p className="mt-2 text-sm text-muted">{point.body}</p>
          </Card>
        </li>
      ))}
    </ul>
  </Section>
);
