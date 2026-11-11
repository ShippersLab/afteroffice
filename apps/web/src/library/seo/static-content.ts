import { HERO } from "../../content/hero.ts";
import { HOW_IT_WORKS } from "../../content/how-it-works.ts";
import { JOIN } from "../../content/join.ts";
import { PRIVACY } from "../../content/privacy.ts";
import { SITE } from "../../content/site.ts";
import { SPONSORS } from "../../content/sponsors.ts";

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (char) => ESCAPES[char] ?? char);

const tag = (name: string, text: string): string => `<${name}>${escapeHtml(text)}</${name}>`;

const list = (items: readonly string[]): string =>
  `<ul>${items.map((item) => tag("li", item)).join("")}</ul>`;

export const renderStaticContent = (): string =>
  [
    "<noscript>",
    tag("h1", HERO.title),
    tag("p", `${HERO.lead} ${HERO.body}`),
    tag("h2", HOW_IT_WORKS.title),
    `<ol>${HOW_IT_WORKS.steps.map((step) => tag("li", `${step.title}. ${step.body}`)).join("")}</ol>`,
    tag("h2", JOIN.title),
    list(
      JOIN.targets.map(
        (target) =>
          `${target.name}: ${target.groups.flatMap((group) => group.commands).join(" then ")}`,
      ),
    ),
    tag("p", `${JOIN.more.name}. ${JOIN.more.body}`),
    tag("h2", PRIVACY.title),
    list(PRIVACY.points.map((point) => `${point.title}. ${point.body}`)),
    tag("h2", SPONSORS.title),
    tag("p", `${SPONSORS.lead} Contact ${SITE.sponsorsEmail}.`),
    "</noscript>",
  ].join("");
