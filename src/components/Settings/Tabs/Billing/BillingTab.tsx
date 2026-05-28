import { CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BillingTab = () => {
  const usageAlarmsMTD = 127;

  const billingItems = [
    {
      label: "Alarms processed (MTD)",
      value: `${usageAlarmsMTD} × $55 = $${usageAlarmsMTD * 55}`,
    },
    {
      label: "Base subscription",
      value: "$299",
    },
    {
      label: "SMS charges",
      value: "$23.50",
    },
  ];

  const estimatedTotal =
    299 + usageAlarmsMTD * 55 + 23.5;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">
          Billing & Subscription
        </h2>

        <p className="text-muted-foreground">
          Manage your subscription and billing
          information
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>
              Current Plan
            </CardTitle>

            <CardDescription>
              Professional Plan -
              Usage-based billing
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">
              <div>
                <p className="text-lg font-semibold">
                  Professional Plan
                </p>

                <p className="text-sm text-muted-foreground">
                  Unlimited users,
                  Advanced features
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold">
                  $299
                </p>

                <p className="text-sm text-muted-foreground">
                  per month
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {billingItems.map(
                (item) => (
                  <div
                    key={item.label}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.label}
                    </span>

                    <span>
                      {item.value}
                    </span>
                  </div>
                )
              )}

              <div className="flex justify-between border-t pt-3 font-semibold">
                <span>
                  Estimated Total
                </span>

                <span>
                  $
                  {estimatedTotal.toFixed(
                    2
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Payment Method
            </CardTitle>

            <CardDescription>
              Your default payment method
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />

              <div>
                <p className="font-medium">
                  •••• •••• •••• 4242
                </p>

                <p className="text-sm text-muted-foreground">
                  Expires 12/26
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
            >
              Update Payment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillingTab;