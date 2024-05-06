import { AI } from "@/lib/code-gen/actions";

import { CodeGenChat } from "@/components/ai/code-gen/CodeGenChat";

const CodeGenPage = () => {
  return (
    <AI>
      <CodeGenChat />
    </AI>
  );
};

export default CodeGenPage;
