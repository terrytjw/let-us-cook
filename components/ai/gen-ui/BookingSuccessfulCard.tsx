import { Badge } from "@/components/ui/badge";
import { CardHeader, CardContent, Card } from "@/components/ui/card";

type BookingSuccessfulCardProps = {
  flightNumber: string;
  passengerName: string;
  bookingReference: string;
};
const BookingSuccessfulCard = ({
  flightNumber,
  passengerName,
  bookingReference,
}: BookingSuccessfulCardProps) => {
  return (
    <Card className="w-full max-w-md rounded-lg bg-card shadow-md">
      <CardHeader className="rounded-t-lg bg-muted px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlaneIcon className="h-5 w-5" />
            <span className="text-lg font-semibold">{flightNumber}</span>
          </div>
          <Badge
            className="rounded-full bg-background px-3 py-1 text-sm font-medium"
            variant="outline"
          >
            Confirmed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">{passengerName}</h3>
            <p className="text-sm">Booking Ref: {bookingReference}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSuccessfulCard;

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
