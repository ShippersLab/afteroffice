import { PRIVACY } from "../../content/privacy";
import { Section, type SectionHeadingProps } from "../layout/section";
import { PixelFrame } from "../ui/pixel-frame";

export const PrivacySection = ({ heading }: SectionHeadingProps) => (
  <Section heading={heading} id="privacy" title={PRIVACY.title} lead={PRIVACY.lead}>
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {PRIVACY.points.map((point) => (
        <li key={point.title}>
          <PixelFrame className="h-full" tone="cyan">
            <h3 className="text-xl">{point.title}</h3>
            <p className="mt-2 text-muted">{point.body}</p>
          </PixelFrame>
        </li>
      ))}
    </ul>
  </Section>
);
