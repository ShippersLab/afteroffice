import { Section } from "../components/layout/section";
import { HowItWorksSection } from "../components/sections/how-it-works-section";
import { JoinSection } from "../components/sections/join-section";
import { PrivacySection } from "../components/sections/privacy-section";
import { SponsorsSection } from "../components/sections/sponsors-section";
import { Button } from "../components/ui/button";
import { NOT_FOUND, type RoutePath } from "../content/routes";

export const ContentRoute = ({ path }: { path: RoutePath | undefined }) => {
  switch (path) {
    case "/how-it-works":
      return <HowItWorksSection heading="h1" />;
    case "/join":
      return <JoinSection heading="h1" />;
    case "/privacy":
      return <PrivacySection heading="h1" />;
    case "/sponsors":
      return <SponsorsSection heading="h1" />;
    default:
      return (
        <Section id="not-found" title={NOT_FOUND.heading} lead={NOT_FOUND.lead} heading="h1">
          <Button href="/">{NOT_FOUND.cta}</Button>
        </Section>
      );
  }
};
