import { type LiveMessage, LiveMessageSchema } from "@afteroffice/core";

export const MAX_MESSAGE_CHARS = 262144;

export const parseLiveMessage = (data: unknown): LiveMessage | undefined => {
  if (typeof data !== "string" || data.length > MAX_MESSAGE_CHARS) return undefined;
  try {
    const result = LiveMessageSchema.safeParse(JSON.parse(data));
    return result.success ? result.data : undefined;
  } catch {
    return undefined;
  }
};

export const onlineCountOf = (message: LiveMessage): number | undefined =>
  message.type === "snapshot" || message.type === "online" ? message.online : undefined;
