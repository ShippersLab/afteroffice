import type { ReactNode } from "react";
import { TopBar } from "../components/layout/top-bar";
import { FooterSection } from "../components/sections/footer-section";
import { Button } from "../components/ui/button";
import { CLUB } from "../content/club";
import type { ConnectionStatus } from "../hooks/use-live-connection";

type ContentPageProps = {
  online: number | undefined;
  status: ConnectionStatus;
  children: ReactNode;
};

export const ContentPage = ({ online, status, children }: ContentPageProps) => (
  <>
    <TopBar online={online} status={status} />
    <main>
      {children}
      <section className="mx-auto flex w-full max-w-[1200px] flex-col items-start gap-4 px-4 pb-20 sm:px-8">
        <h2 className="text-2xl">{CLUB.title}</h2>
        <p className="max-w-[60ch] text-muted">{CLUB.watchBody}</p>
        <Button href="/">{CLUB.watchCta}</Button>
      </section>
    </main>
    <FooterSection />
  </>
);
