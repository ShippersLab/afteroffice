import { HOW_IT_WORKS } from "../../content/how-it-works";
import { Section, type SectionHeadingProps } from "../layout/section";
import { Card } from "../ui/card";

export const HowItWorksSection = ({ heading }: SectionHeadingProps) => (
  <Section heading={heading} id="how-it-works" title={HOW_IT_WORKS.title} lead={HOW_IT_WORKS.lead}>
    <ol className="grid gap-4 md:grid-cols-3">
      {HOW_IT_WORKS.steps.map((step, index) => (
        <li key={step.title}>
          <Card className="flex h-full flex-col gap-2">
            <span className="font-mono text-xs text-muted" aria-hidden="true">
              {index + 1}
            </span>
            <h3 className="text-lg">{step.title}</h3>
            <p className="text-sm text-muted">{step.body}</p>
          </Card>
        </li>
      ))}
    </ol>
  </Section>
);
