import { Link } from "./link";

const SIZES = {
  sm: { image: "size-5", text: "hidden text-xl sm:inline", gap: "gap-2", px: 20 },
  md: { image: "size-7", text: "hidden text-xl sm:inline", gap: "gap-2", px: 28 },
} as const;

export const Logo = ({ size = "md" }: { size?: keyof typeof SIZES }) => {
  const look = SIZES[size];
  return (
    <Link
      className={`inline-flex items-center ${look.gap} text-ivory transition-opacity duration-200 ease-out hover:opacity-85`}
      to="/"
      aria-label="afteroffice.club home"
    >
      <img
        className={`pixelated ${look.image}`}
        src="/favicon.svg"
        alt=""
        width={look.px}
        height={look.px}
      />
      <span className={`font-display font-bold ${look.text}`}>
        afteroffice<span className="text-magenta">.club</span>
      </span>
    </Link>
  );
};
