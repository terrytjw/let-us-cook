import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";

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
  {
    heading: "Build a DAO",
    message: "Build a DAO",
  },
  {
    heading: "Build a Staking Platform",
    message: "Build a Staking Platform",
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
        <div className="mb-4 mt-4 flex flex-col items-start gap-y-2">
          {examplePrompts.map((prompts, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base text-muted-foreground transition-all hover:text-primary"
              name={prompts.message}
              onClick={async () => {
                submitMessage(prompts.message);
              }}
            >
              <Icons.cook size={16} className="mr-2" />
              {prompts.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
