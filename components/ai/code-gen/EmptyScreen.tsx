import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const examplePrompts = [
  {
    heading: "Build a Web3 OnlyFans",
    message: "Build a Web3 OnlyFans",
  },
  {
    heading: "Build a SocialFi app",
    message: "Build a SocialFi app",
  },
  {
    heading: "Build an NFT Marketplace",
    message: "Build an NFT Marketplace",
  },
];
export function EmptyScreen({
  submitMessage,
  className,
}: {
  submitMessage: (message: string) => void;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full transition-all ${className}`}>
      <div className="bg-background p-2">
        <div className="mb-4 mt-4 flex flex-col items-start space-y-2">
          {examplePrompts.map((prompts, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              name={prompts.message}
              onClick={async () => {
                submitMessage(prompts.message);
              }}
            >
              <ArrowRight size={16} className="mr-2 text-muted-foreground" />
              {prompts.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
