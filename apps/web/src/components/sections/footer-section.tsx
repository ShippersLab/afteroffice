import { FOOTER } from "../../content/footer";
import { SITE } from "../../content/site";
import { Link } from "../ui/link";
import { Logo } from "../ui/logo";

export const FooterSection = () => (
  <footer className="border-t border-line bg-panel">
    <div className="mx-auto grid w-full max-w-[1200px] gap-6 px-4 py-10 sm:px-8">
      <Logo />
      <p className="max-w-[60ch] text-sm text-muted">{FOOTER.promise}</p>
      <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
        {FOOTER.links.map((link) => (
          <Link
            className="text-sm text-ivory underline hover:text-cyan"
            key={link.href}
            to={link.href}
          >
            {link.label}
          </Link>
        ))}
        <a className="text-sm text-amber underline" href={`mailto:${SITE.sponsorsEmail}`}>
          {SITE.sponsorsEmail}
        </a>
      </nav>
      <p className="font-mono text-xs text-muted">{SITE.name}</p>
    </div>
  </footer>
);
