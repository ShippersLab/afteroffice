import { HandleSchema } from "@afteroffice/core";
import { normalizePathname } from "./resolve-route.ts";

export const resolveProfile = (pathname: string): string | undefined => {
  const path = normalizePathname(pathname);
  if (!path.startsWith("/@")) return undefined;
  const parsed = HandleSchema.safeParse(path.slice(2));
  return parsed.success ? parsed.data : undefined;
};
