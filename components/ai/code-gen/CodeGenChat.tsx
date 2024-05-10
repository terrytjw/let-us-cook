import ChatMessages from "@/components/ai/code-gen/ChatMessages";
import ChatPanel from "@/components/ai/code-gen/ChatPanel";

const CodeGenChat = () => {
  return (
    <div className="mx-auto flex w-8/12 flex-col space-y-3 px-8 pb-14 pt-6 md:space-y-4 md:px-12 md:pb-24 md:pt-8">
      <ChatMessages />
      <ChatPanel />
    </div>
  );
};

export default CodeGenChat;
