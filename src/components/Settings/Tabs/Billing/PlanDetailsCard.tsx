import { CreditCard } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetProfileQuery } from "@/store/apis/profileApi";
import Loader from "@/components/common/Loader";

const PlanDetailsCard = () => {
  const { data, isLoading } = useGetProfileQuery();
  const profile = data?.data;
  const plan = profile?.plan;

  if (isLoading) {
    return <Loader />;
  }

  if (!plan) {
    return null;
  }

  const currency = plan.currency ? plan.currency?.toUpperCase() : "USD";

  const intervalLabel =
    plan.interval === "month"
      ? "month"
      : plan.interval === "year"
        ? "year"
        : plan.interval;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100">
            <CreditCard className="size-5 text-blue-600" />
          </div>

          <div>
            <CardTitle>Current Plan</CardTitle>

            <CardDescription>
              {plan.name} - {intervalLabel}ly billing
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">
          <div>
            <p className="text-lg font-semibold">{plan.name}</p>

            <p className="text-sm text-muted-foreground">{plan.description}</p>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold">
              {currency} {plan.amount ? plan.amount / 100 : "-"}
            </p>

            <p className="text-sm text-muted-foreground">per {intervalLabel}</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold">Features</p>

          {plan.features?.map((item: string) => (
            <div key={item} className="flex items-center text-sm">
              <span>{item}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanDetailsCard;
