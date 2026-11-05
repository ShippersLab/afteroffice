import type { ReactNode } from "react";

export type SectionHeadingProps = { heading?: "h1" | "h2" | undefined };

type SectionProps = SectionHeadingProps & {
  id: string;
  title: string;
  lead?: string;
  titleClassName?: string;
  children: ReactNode;
};

export const Section = ({
  id,
  title,
  lead,
  heading = "h2",
  titleClassName = "",
  children,
}: SectionProps) => {
  const Heading = heading;
  return (
    <section
      className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-8 sm:py-20"
      id={id}
      aria-labelledby={`${id}-title`}
    >
      <Heading className={`text-[clamp(1.75rem,4vw,2.5rem)] ${titleClassName}`} id={`${id}-title`}>
        {title}
      </Heading>
      {lead ? <p className="mt-3 max-w-[60ch] text-lg text-muted">{lead}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  );
};
