import type { ReactNode } from "react";

export type SectionHeadingProps = { heading?: "h1" | "h2" | undefined };

type SectionProps = SectionHeadingProps & {
  id: string;
  title: string;
  lead?: string;
  children: ReactNode;
};

export const Section = ({ id, title, lead, heading = "h2", children }: SectionProps) => {
  const Heading = heading;
  return (
    <section
      className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-8 sm:py-20"
      id={id}
      aria-labelledby={`${id}-title`}
    >
      <Heading className="text-[clamp(1.75rem,3.5vw,2.5rem)] text-balance" id={`${id}-title`}>
        {title}
      </Heading>
      {lead ? (
        <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-muted">{lead}</p>
      ) : null}
      <div className="mt-10">{children}</div>
    </section>
  );
};
