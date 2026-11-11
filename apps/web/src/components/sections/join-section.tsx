import { JOIN } from "../../content/join";
import { Section, type SectionHeadingProps } from "../layout/section";
import { ClaudeLogo, OpenCodeLogo } from "../ui/agent-logos";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { CodeBlock } from "../ui/code-block";
import { IconBadge } from "../ui/icon";

const LOGOS = {
  claude: { Logo: ClaudeLogo, tone: "bg-magenta/15 text-magenta" },
  opencode: { Logo: OpenCodeLogo, tone: "bg-cyan/15 text-cyan" },
} as const;

export const JoinSection = ({ heading }: SectionHeadingProps) => (
  <Section heading={heading} id="join" title={JOIN.title} lead={JOIN.lead}>
    <div className="grid gap-6 lg:grid-cols-2">
      {JOIN.targets.map((target) => {
        const { Logo, tone } = LOGOS[target.logo];
        return (
          <Card className="flex min-w-0 flex-col gap-6 p-5 sm:p-6" key={target.name}>
            <div className="flex items-center gap-3">
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-md border border-line/60 ${tone}`}
              >
                <Logo className="size-5" />
              </span>
              <h3 className="text-lg">{target.name}</h3>
            </div>
            {target.groups.map((group) => (
              <div className="flex flex-col gap-2" key={group.label}>
                <p className="font-mono text-xs text-muted">{group.label}</p>
                {group.commands.map((command) => (
                  <CodeBlock code={command} key={command} />
                ))}
              </div>
            ))}
          </Card>
        );
      })}
      <Card className="flex min-w-0 flex-col gap-3 p-5 sm:p-6 lg:col-span-2">
        <div className="flex flex-wrap items-center gap-3">
          <IconBadge name={JOIN.more.icon} tone="lilac" />
          <h3 className="text-lg">{JOIN.more.name}</h3>
          <Badge tone="amber">{JOIN.soon}</Badge>
        </div>
        <p className="max-w-[60ch] text-sm text-muted">{JOIN.more.body}</p>
      </Card>
    </div>
  </Section>
);
