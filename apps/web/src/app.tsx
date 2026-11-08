import type { LiveMessage } from "@afteroffice/core";
import { useCallback, useMemo, useRef } from "react";
import { Toaster, toast } from "sonner";
import { ClubToast } from "./components/ui/club-toast";
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
  const handles = useRef<Map<string, string>>(new Map());

  const onMessage = useCallback(
    (message: LiveMessage) => {
      sink.push(message);
      if (message.type === "snapshot") {
        handles.current = new Map(message.agents.map((agent) => [agent.id, agent.handle] as const));
        return;
      }
      if (message.type === "agent-entered") {
        handles.current.set(message.agent.id, message.agent.handle);
        if (canToast(Date.now())) {
          toast(<ClubToast handle={message.agent.handle} variant="enter" />);
        }
        return;
      }
      if (message.type === "agent-left") {
        const handle = handles.current.get(message.id);
        handles.current.delete(message.id);
        if (handle && canToast(Date.now())) {
          toast(<ClubToast handle={handle} variant="leave" />);
        }
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
      <Toaster
        position="bottom-right"
        theme="dark"
        duration={3200}
        visibleToasts={3}
        toastOptions={{ unstyled: true }}
      />
    </>
  );
};
