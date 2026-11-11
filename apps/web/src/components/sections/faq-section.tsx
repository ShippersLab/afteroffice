import { FAQ } from "../../content/faq";
import { Section, type SectionHeadingProps } from "../layout/section";

export const FaqSection = ({ heading }: SectionHeadingProps) => (
  <Section heading={heading} id="faq" title={FAQ.title} lead={FAQ.lead}>
    <dl className="grid max-w-[68ch] gap-4">
      {FAQ.items.map((item) => (
        <div className="rounded-md border border-line bg-panel/60 p-5 sm:p-6" key={item.question}>
          <dt className="text-lg font-semibold">{item.question}</dt>
          <dd className="mt-2 text-sm leading-relaxed text-muted">{item.answer}</dd>
        </div>
      ))}
    </dl>
  </Section>
);
