import {
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type FlightInfoProps = {
  flightInfo: {
    flightNumber: string;
    departureTime: string;
    departure: string;
    arrival: string;
  };
};
const FlightInfoCard = ({ flightInfo }: FlightInfoProps) => {
  const { flightNumber, departure, arrival, departureTime } = flightInfo;

  return (
    <Card className="w-full max-w-md bg-card">
      <CardHeader className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <PlaneIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          <span className="font-medium">{flightNumber}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <ClockIcon className="h-4 w-4" />
          <span>{departureTime}</span>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-[1fr] items-center gap-4 px-6 py-4">
        <div className="grid gap-1">
          <div className="flex items-center justify-center gap-2">
            <span className="font-medium">{departure}</span>
            <ArrowRightIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="font-medium">{arrival}</span>
          </div>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            Non-stop flight
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-center gap-2 px-6 py-4">
        <Button asChild variant="outline">
          <Link
            className="flex gap-x-2"
            href="https://unchainedcrypto.com/wp-content/uploads/2024/03/download.png"
            target="_blank"
          >
            <TicketIcon className="h-4 w-4" />
            <span>View Ticket</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FlightInfoCard;

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function PlaneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  );
}

function TicketIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  );
}
