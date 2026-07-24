import { CircleX } from "lucide-react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";

export default function PaymentFailed() {
  return (
    <div className="flex h-full min-h-[calc(100vh-8rem)] items-center justify-center px-6">
      <div className="flex max-w-xl flex-col items-center text-center">
        <div className="mb-6 rounded-full bg-red-100 p-5">
          <CircleX className="h-16 w-16 text-red-600" />
        </div>

        <h1 className="text-3xl font-bold">Payment Failed</h1>

        <p className="mt-3 text-muted-foreground">
          We couldn't process your payment. Please try again.
        </p>

        <Button asChild className="mt-8">
          <Link to="/plan">Try Again</Link>
        </Button>
      </div>
    </div>
  );
}