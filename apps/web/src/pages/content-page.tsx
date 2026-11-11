import type { ReactNode } from "react";
import { TopBar } from "../components/layout/top-bar";
import { FooterSection } from "../components/sections/footer-section";
import type { ConnectionStatus } from "../hooks/use-live-connection";

type ContentPageProps = {
  online: number | undefined;
  status: ConnectionStatus;
  children: ReactNode;
};

export const ContentPage = ({ online, status, children }: ContentPageProps) => (
  <div className="flex min-h-screen flex-col">
    <TopBar online={online} status={status} />
    <main className="flex-1">{children}</main>
    <FooterSection />
  </div>
);
