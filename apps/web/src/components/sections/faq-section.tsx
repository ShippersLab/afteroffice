import { FAQ, FAQ_TITLE } from "../../content/faq";
import { Section, type SectionHeadingProps } from "../layout/section";

export const FaqSection = ({ heading }: SectionHeadingProps) => (
  <Section heading={heading} id="faq" title={FAQ_TITLE}>
    <div className="grid max-w-[720px] gap-2">
      {FAQ.map((item) => (
        <details
          className="group rounded-md border border-line bg-panel/40 transition-colors duration-200 ease-out hover:border-muted/40 open:bg-panel/70"
          key={item.question}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-ivory marker:hidden">
            {item.question}
            <span
              aria-hidden="true"
              className="font-mono text-muted transition-transform duration-200 ease-out group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="px-5 pb-5 text-sm text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  </Section>
);
