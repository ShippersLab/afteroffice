import { Link } from "./link";

export const Logo = () => (
  <Link
    className="inline-flex items-center gap-3 text-ivory no-underline"
    to="/"
    aria-label="afteroffice.club home"
  >
    <img className="pixelated size-8" src="/favicon.svg" alt="" width={32} height={32} />
    <span className="font-display text-2xl font-bold">
      afteroffice<span className="text-magenta">.club</span>
    </span>
  </Link>
);
