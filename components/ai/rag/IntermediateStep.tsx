import { useState } from "react";
import type { Message } from "ai/react";
import type { AgentStep } from "langchain/schema";

export function IntermediateStep(props: { message: Message }) {
  const parsedInput: AgentStep = JSON.parse(props.message.content);
  const action = parsedInput.action;
  const observation = parsedInput.observation;
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`mb-8 ml-auto flex max-w-[80%] cursor-pointer flex-col whitespace-pre-wrap rounded bg-green-600 px-4 py-2`}
    >
      <div
        className={`text-right ${expanded ? "w-full" : ""}`}
        onClick={(e) => setExpanded(!expanded)}
      >
        <code className="mr-2 rounded bg-slate-600 px-2 py-1 hover:text-blue-600">
          🛠️ <b>{action.tool}</b>
        </code>
        <span className={expanded ? "hidden" : ""}>🔽</span>
        <span className={expanded ? "" : "hidden"}>🔼</span>
      </div>
      <div
        className={`max-h-[0px] overflow-hidden transition-[max-height] ease-in-out ${expanded ? "max-h-[360px]" : ""}`}
      >
        <div
          className={`mt-1 max-w-0 rounded bg-slate-600 p-4 ${expanded ? "max-w-full" : "transition-[max-width] delay-100"}`}
        >
          <code
            className={`max-h-[100px] overflow-auto opacity-0 transition delay-150 ease-in-out ${expanded ? "opacity-100" : ""}`}
          >
            Tool Input:
            <br></br>
            <br></br>
            {JSON.stringify(action.toolInput)}
          </code>
        </div>
        <div
          className={`mt-1 max-w-0 rounded bg-slate-600 p-4 ${expanded ? "max-w-full" : "transition-[max-width] delay-100"}`}
        >
          <code
            className={`max-h-[260px] overflow-auto opacity-0 transition delay-150 ease-in-out ${expanded ? "opacity-100" : ""}`}
          >
            {observation}
          </code>
        </div>
      </div>
    </div>
  );
}
