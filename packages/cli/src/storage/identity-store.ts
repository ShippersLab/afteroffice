import { readFile, rm } from "node:fs/promises";
import { HandleSchema } from "@afteroffice/core";
import { z } from "zod";
import { identityPath } from "../storage/paths";
import { writePrivateJson } from "../storage/secure-file";

export const IdentitySchema = z.strictObject({
  handle: HandleSchema,
  token: z.string().min(16).max(256),
  url: z.url({ protocol: /^https?$/ }),
});

export type Identity = z.infer<typeof IdentitySchema>;

export async function readIdentity(): Promise<Identity | undefined> {
  try {
    const raw: unknown = JSON.parse(await readFile(identityPath(), "utf8"));
    const parsed = IdentitySchema.safeParse(raw);
    return parsed.success ? parsed.data : undefined;
  } catch {
    return undefined;
  }
}

export async function writeIdentity(identity: Identity): Promise<void> {
  await writePrivateJson(identityPath(), IdentitySchema.parse(identity));
}

export async function clearIdentity(): Promise<void> {
  await rm(identityPath(), { force: true });
}
