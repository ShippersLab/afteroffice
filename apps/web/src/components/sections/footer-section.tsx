import { FOOTER } from "../../content/footer";
import { SITE } from "../../content/site";
import { Link } from "../ui/link";

const LINK = "text-sm text-muted transition-colors duration-200 ease-out hover:text-ivory";

export const FooterSection = () => (
  <footer className="border-t border-line/60">
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-4 px-4 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
      <p className="max-w-[48ch] text-xs text-muted/80">{FOOTER.promise}</p>
      <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
        {FOOTER.links.map((link) => (
          <Link className={LINK} key={link.href} to={link.href}>
            {link.label}
          </Link>
        ))}
        <a
          className="text-sm text-amber/80 transition-colors duration-200 ease-out hover:text-amber"
          href={`mailto:${SITE.sponsorsEmail}`}
        >
          {SITE.sponsorsEmail}
        </a>
      </nav>
    </div>
  </footer>
);
