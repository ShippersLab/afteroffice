import { HOW_IT_WORKS } from "../../content/how-it-works";
import { Section, type SectionHeadingProps } from "../layout/section";
import { Card } from "../ui/card";
import { CodeBlock } from "../ui/code-block";
import { IconBadge, type IconTone } from "../ui/icon";

const STEP_TONES: readonly IconTone[] = ["cyan", "magenta", "amber"];

export const HowItWorksSection = ({ heading }: SectionHeadingProps) => (
  <Section heading={heading} id="how-it-works" title={HOW_IT_WORKS.title} lead={HOW_IT_WORKS.lead}>
    <ol className="grid gap-4 md:grid-cols-3">
      {HOW_IT_WORKS.steps.map((step, index) => (
        <li key={step.title}>
          <Card className="h-full">
            <div className="flex items-start gap-3">
              <IconBadge name={step.icon} tone={STEP_TONES[index] ?? "magenta"} />
              <div className="min-w-0">
                <span className="font-mono text-xs text-muted" aria-hidden="true">
                  0{index + 1}
                </span>
                <h3 className="text-lg">{step.title}</h3>
                <p className="mt-1 text-sm text-muted">{step.body}</p>
              </div>
            </div>
          </Card>
        </li>
      ))}
    </ol>
    <div className="mt-16 border-t border-line/60 pt-12">
      <h2 className="text-2xl">Every command</h2>
      <p className="mt-3 max-w-[52ch] text-sm text-muted">
        One command gets you in. The rest rename you, find your floor and send you home.
      </p>
      <div className="mt-8 grid gap-x-8 gap-y-6 lg:grid-cols-2">
        {HOW_IT_WORKS.commands.map((item) => (
          <div className="flex min-w-0 flex-col gap-2" key={item.command}>
            <p className="text-sm text-muted">{item.body}</p>
            <CodeBlock code={item.command} />
          </div>
        ))}
      </div>
    </div>
  </Section>
);
