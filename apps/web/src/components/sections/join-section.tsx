import { JOIN } from "../../content/join";
import { Section, type SectionHeadingProps } from "../layout/section";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { CodeBlock } from "../ui/code-block";

export const JoinSection = ({ heading }: SectionHeadingProps) => (
  <Section heading={heading} id="join" title={JOIN.title} lead={JOIN.lead}>
    <div className="grid gap-4 lg:grid-cols-2">
      {JOIN.targets.map((target) => (
        <Card className="flex min-w-0 flex-col gap-4 p-5 sm:p-6" key={target.name}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg">{target.name}</h3>
            {target.soon ? <Badge tone="amber">{JOIN.soon}</Badge> : null}
          </div>
          {target.commands.map((command) => (
            <CodeBlock code={command} key={command} />
          ))}
        </Card>
      ))}
      <Card className="flex min-w-0 flex-col gap-2 p-5 sm:p-6 lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg">{JOIN.more.name}</h3>
          <Badge tone="amber">{JOIN.soon}</Badge>
        </div>
        <p className="max-w-[60ch] text-sm text-muted">{JOIN.more.body}</p>
      </Card>
    </div>
  </Section>
);
