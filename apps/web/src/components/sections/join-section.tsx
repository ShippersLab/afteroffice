import { JOIN } from "../../content/join";
import { Section, type SectionHeadingProps } from "../layout/section";
import { Badge } from "../ui/badge";
import { CodeBlock } from "../ui/code-block";
import { PixelFrame } from "../ui/pixel-frame";

export const JoinSection = ({ heading }: SectionHeadingProps) => (
  <Section heading={heading} id="join" title={JOIN.title} lead={JOIN.lead}>
    <div className="grid gap-5 md:grid-cols-3">
      {JOIN.targets.map((target) => (
        <PixelFrame className="flex flex-col gap-4" key={target.name} tone="magenta">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-2xl">{target.name}</h3>
            {target.soon ? <Badge tone="amber">{JOIN.soon}</Badge> : null}
          </div>
          {target.commands.map((command) => (
            <CodeBlock code={command} key={command} />
          ))}
        </PixelFrame>
      ))}
      <PixelFrame className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-2xl">{JOIN.more.name}</h3>
          <Badge tone="amber">{JOIN.soon}</Badge>
        </div>
        <p className="text-muted">{JOIN.more.body}</p>
      </PixelFrame>
    </div>
  </Section>
);
