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
  <div className="flex min-h-screen flex-col">
    <TopBar online={online} status={status} />
    <main className="flex-1">
      {children}
      <section className="mx-auto flex w-full max-w-[1200px] flex-col items-start gap-3 px-4 pb-16 sm:px-8">
        <h2 className="text-2xl leading-tight">{CLUB.title}</h2>
        <p className="max-w-[52ch] text-sm text-muted">{CLUB.watchBody}</p>
        <Button href="/">{CLUB.watchCta}</Button>
      </section>
    </main>
    <FooterSection />
  </div>
);
