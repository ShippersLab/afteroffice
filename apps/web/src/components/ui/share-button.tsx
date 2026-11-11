import { xIntentUrl } from "../../library/sharing/share-links";
import { Button } from "./button";

type ShareButtonProps = {
  text: string;
  url: string;
  label: string;
  variant?: "primary" | "secondary";
};

export const ShareButton = ({ text, url, label, variant = "secondary" }: ShareButtonProps) => (
  <Button external href={xIntentUrl(text, url)} variant={variant}>
    {label}
  </Button>
);
