import { AI } from "@/lib/code-gen/actions";

import CodeGenChat from "@/components/ai/code-gen/CodeGenChat";

export const maxDuration = 60;

const CodeGenPage = () => {
  return (
    <AI>
      <CodeGenChat />
    </AI>
  );
};

export default CodeGenPage;
