import { StreamableValue, useUIState } from "ai/rsc";
import type { AI } from "@/lib/code-gen/actions";

import CollapsibleMessage from "@/components/ai/code-gen/CollapsibleMessage";

const ChatMessages = () => {
  const [messages, setMessages] = useUIState<typeof AI>();

  return (
    <>
      {messages.map(
        (message: {
          id: number;
          component: React.ReactNode;
          isCollapsed?: StreamableValue<boolean>;
        }) => (
          <CollapsibleMessage
            key={message.id}
            message={message}
            isLastMessage={message.id === messages[messages.length - 1].id}
          />
        ),
      )}
    </>
  );
};

export default ChatMessages;
