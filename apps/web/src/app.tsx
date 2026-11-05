import type { LiveMessage } from "@afteroffice/core";
import { useCallback, useMemo } from "react";
import { Toaster, toast } from "sonner";
import { NOT_FOUND } from "./content/routes";
import { useLiveConnection } from "./hooks/use-live-connection";
import { usePageMetadata } from "./hooks/use-page-metadata";
import { usePathname } from "./hooks/use-pathname";
import { createMessageSink } from "./library/realtime/message-sink";
import { canonicalUrl, resolveRoute } from "./library/routing/resolve-route";
import { ClubPage } from "./pages/club-page";
import { ContentPage } from "./pages/content-page";
import { ContentRoute } from "./pages/content-route";
import { createThrottle } from "./utilities/throttle";

const TOAST_INTERVAL_MS = 4000;

export const App = () => {
  const sink = useMemo(createMessageSink, []);
  const canToast = useMemo(() => createThrottle(TOAST_INTERVAL_MS), []);

  const onMessage = useCallback(
    (message: LiveMessage) => {
      sink.push(message);
      if (message.type === "agent-entered" && canToast(Date.now())) {
        toast(`${message.agent.handle} just walked in`);
      }
    },
    [sink, canToast],
  );

  const { status, online } = useLiveConnection(onMessage);
  const route = resolveRoute(usePathname());
  usePageMetadata(
    route?.title ?? NOT_FOUND.title,
    route?.description ?? NOT_FOUND.description,
    canonicalUrl(route?.path ?? "/"),
  );

  return (
    <>
      {route?.path === "/" ? (
        <ClubPage sink={sink} online={online} status={status} />
      ) : (
        <ContentPage online={online} status={status}>
          <ContentRoute path={route?.path} />
        </ContentPage>
      )}
      <Toaster position="bottom-right" theme="dark" duration={3000} visibleToasts={3} />
    </>
  );
};
