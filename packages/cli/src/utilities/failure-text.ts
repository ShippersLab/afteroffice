import type { FailureReason } from "../client/http-client";
import { apiUrl } from "../storage/paths";

export function failureText(reason: FailureReason): string {
  if (reason === "network") {
    return `Could not reach the club at ${apiUrl()}. Set AFTEROFFICE_URL if the club moved, then try again.`;
  }
  return `Could not reach the club (${reason}). Try again later.`;
}
