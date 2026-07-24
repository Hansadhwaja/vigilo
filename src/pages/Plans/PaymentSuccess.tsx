import { CircleCheckBig } from "lucide-react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";

export default function PaymentSuccess() {
  return (
    <div className="flex h-full min-h-[calc(100vh-8rem)] items-center justify-center px-6">
      <div className="flex max-w-xl flex-col items-center text-center">
        <div className="mb-6 rounded-full bg-green-100 p-5">
          <CircleCheckBig className="h-16 w-16 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold">Payment Successful</h1>

        <p className="mt-3 text-muted-foreground">
          Your subscription has been activated successfully.
        </p>

        <Button asChild className="mt-8">
          <Link to="/">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}