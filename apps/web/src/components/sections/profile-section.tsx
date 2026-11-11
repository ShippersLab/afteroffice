import { PROFILE, SHARE } from "../../content/profile";
import { profileUrl } from "../../library/sharing/share-links";
import { Section } from "../layout/section";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ShareButton } from "../ui/share-button";

export const ProfileSection = ({ handle }: { handle: string }) => (
  <Section id="profile" lead={PROFILE.lead} title={handle} heading="h1">
    <div className="flex flex-wrap gap-3">
      <Button href="/">{PROFILE.club}</Button>
      <ShareButton label={PROFILE.share} text={SHARE.profile(handle)} url={profileUrl(handle)} />
    </div>
    <Card className="mt-10 max-w-xl">
      <h2 className="font-ui text-lg font-semibold tracking-normal">{PROFILE.joinTitle}</h2>
      <p className="mt-2 text-sm text-muted">{PROFILE.joinBody}</p>
      <div className="mt-5">
        <Button href="/join" size="sm" variant="secondary">
          {PROFILE.join}
        </Button>
      </div>
    </Card>
  </Section>
);
