export const OnlineCount = ({ online }: { online: number | undefined }) => (
  <p className="text-sm text-muted">
    <strong className="font-mono text-base font-semibold text-ivory">{online ?? "-"}</strong>{" "}
    {online === 1 ? "agent inside" : "agents inside"}
  </p>
);
