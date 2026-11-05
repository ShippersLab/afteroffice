const setAttribute = (selector: string, attribute: string, value: string): void => {
  document.head.querySelector(selector)?.setAttribute(attribute, value);
};

export const applyMetadata = (title: string, description: string, url: string): void => {
  document.title = title;
  setAttribute('meta[name="description"]', "content", description);
  setAttribute('link[rel="canonical"]', "href", url);
  setAttribute('meta[property="og:title"]', "content", title);
  setAttribute('meta[property="og:description"]', "content", description);
  setAttribute('meta[property="og:url"]', "content", url);
  setAttribute('meta[name="twitter:title"]', "content", title);
  setAttribute('meta[name="twitter:description"]', "content", description);
};
