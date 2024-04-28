import { Icons } from "@/components/Icons";

type SpinnerProps = {
  message: string;
};
const Spinner = ({ message }: SpinnerProps) => {
  return (
    <div className="flex items-center gap-2">
      <Icons.loading className="h-4 w-4 animate-spin" />
      {message}
    </div>
  );
};

export default Spinner;
