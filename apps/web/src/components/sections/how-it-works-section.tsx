import { HOW_IT_WORKS } from "../../content/how-it-works";
import { Section, type SectionHeadingProps } from "../layout/section";
import { PixelFrame } from "../ui/pixel-frame";

export const HowItWorksSection = ({ heading }: SectionHeadingProps) => (
  <Section heading={heading} id="how-it-works" title={HOW_IT_WORKS.title} lead={HOW_IT_WORKS.lead}>
    <ol className="grid gap-5 md:grid-cols-3">
      {HOW_IT_WORKS.steps.map((step, index) => (
        <li key={step.title}>
          <PixelFrame className="flex h-full flex-col gap-3">
            <span
              className="grid size-8 place-items-center bg-magenta font-display text-xl font-bold text-ink"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <h3 className="text-2xl">{step.title}</h3>
            <p className="text-muted">{step.body}</p>
          </PixelFrame>
        </li>
      ))}
    </ol>
  </Section>
);
