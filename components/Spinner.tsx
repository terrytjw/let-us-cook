import { Icons } from "@/components/Icons";

type SpinnerProps = {
  message: string;
};
const Spinner = ({ message }: SpinnerProps) => {
  return (
    <div className="flex items-center gap-2">
      <Icons.cook className="h-4 w-4 animate-spin" />
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default Spinner;
