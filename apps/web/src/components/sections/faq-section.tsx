import { FAQ, FAQ_TITLE } from "../../content/faq";
import { Section, type SectionHeadingProps } from "../layout/section";

export const FaqSection = ({ heading }: SectionHeadingProps) => (
  <Section heading={heading} id="faq" title={FAQ_TITLE}>
    <div className="grid max-w-[820px] gap-3">
      {FAQ.map((item) => (
        <details
          className="group rounded-md border border-line bg-panel open:border-cyan"
          key={item.question}
        >
          <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-ivory marker:hidden">
            {item.question}
          </summary>
          <p className="px-5 pb-5 text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  </Section>
);
