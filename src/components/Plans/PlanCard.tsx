import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import type { Plan } from "@/types";
import { Check, Crown } from "lucide-react";
import { useSubscribePlanMutation } from "@/store/apis/plansApi";
import { toast } from "sonner";
import Loader from "../common/Loader";

const PlanCard = ({ plan }: { plan: Plan }) => {
  const popularPlan = plan.interval === "year";
  const [subscribePlan, { isLoading }] = useSubscribePlanMutation();

  const handleSubscribe = async () => {
    try {
      const res = await subscribePlan({ planId: plan.id }).unwrap();
      if (res?.success) {
        toast.success("Checkout Session Created");
        window.location.href = res?.data?.url;
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while trying to subscribe");
    }
  };

  return (
    <Card
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl",
        popularPlan
          ? "border-amber-400 bg-linear-to-b from-amber-50 via-background to-background shadow-amber-200/40 dark:border-amber-500 dark:from-amber-500/10 dark:shadow-amber-500/10"
          : "border-border bg-background hover:border-primary/30",
      )}
    >
      {popularPlan && (
        <Badge className="absolute top-5 right-5 gap-1 rounded-full bg-amber-500 px-3 py-1 text-black hover:bg-amber-500">
          <Crown className="size-3.5 fill-current" />
          Best Value
        </Badge>
      )}

      <CardHeader className="space-y-6 pb-6 text-center">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold tracking-tight">{plan.name}</h3>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {plan.description}
          </p>
        </div>

        <div className="space-y-2">
          {plan.amount ? (
            <>
              <div className="flex items-end justify-center gap-1">
                <span
                  className={cn(
                    "text-5xl font-extrabold tracking-tight",
                    popularPlan
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-foreground",
                  )}
                >
                  ${plan.amount}
                </span>

                <span className="pb-2 text-muted-foreground">
                  /{plan.interval}
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                Billed every {plan.interval}
              </p>
            </>
          ) : (
            <>
              <h2 className="text-5xl font-extrabold">Custom</h2>

              <p className="text-sm text-muted-foreground">
                Contact us for pricing
              </p>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="border-border/60 border-t pt-6">
          <p className="mb-4 text-sm font-semibold">What's included</p>

          <div className="space-y-4">
            {plan.features.map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-0.5 rounded-full p-1",
                    popularPlan
                      ? "bg-amber-100 dark:bg-amber-500/20"
                      : "bg-primary/10",
                  )}
                >
                  <Check
                    className={cn(
                      "size-3",
                      popularPlan
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-primary",
                    )}
                  />
                </div>

                <span className="text-sm text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-8">
        <Button
          onClick={handleSubscribe}
          disabled={isLoading}
          className={cn(
            "h-11 w-full rounded-xl text-base font-semibold transition-all",
            popularPlan
              ? "bg-amber-500 text-black hover:bg-amber-600 shadow-sm shadow-amber-300/40"
              : "",
          )}
        >
          {isLoading ? (
            <Loader />
          ) : plan.amount ? (
            "Choose Plan"
          ) : (
            "Contact Sales"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlanCard;
