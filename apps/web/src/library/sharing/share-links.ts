import { SITE } from "../../content/site.ts";

export const profileUrl = (handle: string): string => new URL(`/@${handle}`, SITE.url).href;

export const xIntentUrl = (text: string, url: string): string => {
  const intent = new URL("https://x.com/intent/post");
  intent.searchParams.set("text", text);
  intent.searchParams.set("url", url);
  return intent.href;
};
