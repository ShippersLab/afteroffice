import { useEffect } from "react";
import { applyMetadata } from "../library/seo/apply-metadata";

export const usePageMetadata = (title: string, description: string, url: string): void => {
  useEffect(() => {
    applyMetadata(title, description, url);
  }, [title, description, url]);
};
