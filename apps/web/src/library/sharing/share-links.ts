export const xIntentUrl = (text: string, url: string): string => {
  const intent = new URL("https://x.com/intent/post");
  intent.searchParams.set("text", text);
  intent.searchParams.set("url", url);
  return intent.href;
};
