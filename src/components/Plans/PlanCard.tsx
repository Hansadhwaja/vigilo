import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { cn, formatDate } from "@/lib/utils";
import type { Plan } from "@/types";
import { Check, Crown } from "lucide-react";
import {
  useCancelPlanMutation,
  useSubscribePlanMutation,
} from "@/store/apis/plansApi";
import { toast } from "sonner";
import Loader from "../common/Loader";
import { useGetProfileQuery } from "@/store/apis/profileApi";

const PlanCard = ({ plan }: { plan: Plan }) => {
  const popularPlan = plan.interval === "year";

  const { data: profileResponse, isLoading: isProfileLoading } =
    useGetProfileQuery();

  const profile = profileResponse?.data;

  const [subscribePlan, { isLoading }] = useSubscribePlanMutation();
  const [cancelPlan, { isLoading: isCancellingSubscription }] =
    useCancelPlanMutation();

  const handleSubscribe = async () => {
    try {
      const res = await subscribePlan({ planId: plan.id }).unwrap();
      if (res?.success) {
        toast.success("Checkout Session Created");
        window.location.href = res?.data?.url;
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.error ||
        "Error while trying to subscribe";

      toast.error(message);
    }
  };

  const isCurrentPlan = profile?.planId === plan.id;

  const isExpired =
    isCurrentPlan &&
    !!profile?.subscriptionEnd &&
    new Date(profile.subscriptionEnd) < new Date();

  const isActive =
    isCurrentPlan && profile?.subscriptionStatus === "active" && !isExpired;

  const isPlanCancelled =
    !!profile?.cancelAtPeriodEnd &&
    !!profile?.subscriptionEnd &&
    new Date(profile.subscriptionEnd) > new Date();

  const isCancelledCurrentPlan = isPlanCancelled && isCurrentPlan;
  const isOtherPlanBlocked = isPlanCancelled && !isCurrentPlan;

  const handleCancel = async () => {
    try {
      const res = await cancelPlan({ planId: plan.id }).unwrap();

      toast.success(res?.data?.message ?? "Plan Cancelled Successfully");
    } catch (error: any) {
      console.log(error);
      const message =
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.error ||
        "Error while trying to cancel plan";

      toast.error(message);
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
      <CardHeader className="space-y-6 pb-6 text-center">
        <div className="space-y-3">
          {popularPlan && (
            <Badge className="gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs text-black hover:bg-amber-500 lg:text-sm">
              <Crown className="size-3.5 fill-current lg:size-4" />
              Best Value
            </Badge>
          )}

          <h3 className="text-2xl font-bold tracking-tight lg:text-3xl">
            {plan.name}
          </h3>

          <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
            {plan.description}
          </p>
        </div>

        <div className="space-y-2">
          {plan.amount ? (
            <>
              <div className="flex items-end justify-center gap-1">
                <span
                  className={cn(
                    "text-5xl font-extrabold tracking-tight lg:text-6xl",
                    popularPlan
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-foreground",
                  )}
                >
                  ${plan.amount / 100}
                </span>

                <span className="pb-2 text-sm text-muted-foreground lg:pb-3 lg:text-base">
                  /{plan.interval}
                </span>
              </div>

              <p className="text-xs text-muted-foreground lg:text-sm">
                Billed every {plan.interval}
              </p>
            </>
          ) : (
            <>
              <h2 className="text-5xl font-extrabold lg:text-6xl">Custom</h2>

              <p className="text-sm text-muted-foreground lg:text-base">
                Contact us for pricing
              </p>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="border-border/60 border-t pt-6">
          <p className="mb-4 text-sm font-semibold lg:text-base">
            What's included
          </p>

          <div className="space-y-4">
            {plan.features.map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-0.5 rounded-full p-1 lg:p-1.5",
                    popularPlan
                      ? "bg-amber-100 dark:bg-amber-500/20"
                      : "bg-primary/10",
                  )}
                >
                  <Check
                    className={cn(
                      "size-3 lg:size-3.5",
                      popularPlan
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-primary",
                    )}
                  />
                </div>

                <span className="text-sm text-muted-foreground lg:text-base">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-8">
        {isCancelledCurrentPlan ? (
          <div className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center dark:border-amber-500/20 dark:bg-amber-500/10">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              Subscription cancelled
            </p>

            <p className="mt-1 text-sm text-amber-700/80 dark:text-amber-400/80">
              Your plan remains active until{" "}
              {formatDate(profile.subscriptionEnd!)}.
            </p>
          </div>
        ) : isOtherPlanBlocked ? (
          <div className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Available after current plan ends
            </p>

            <p className="mt-1 text-sm text-muted-foreground/70">
              {profile?.subscriptionEnd &&
                `Available from ${formatDate(profile.subscriptionEnd)}`}
            </p>
          </div>
        ) : isActive ? (
          <Button
            variant="outline"
            className="h-11 w-full rounded-xl text-base font-semibold text-destructive hover:text-destructive"
            onClick={handleCancel}
            disabled={isCancellingSubscription}
          >
            {isCancellingSubscription ? <Loader /> : "Cancel Subscription"}
          </Button>
        ) : isExpired ? (
          <Button
            onClick={handleSubscribe}
            disabled={isLoading}
            className={cn(
              "h-11 w-full rounded-xl text-base font-semibold",
              popularPlan &&
                "bg-amber-500 text-black shadow-sm shadow-amber-300/40 hover:bg-amber-600",
            )}
          >
            {isLoading ? <Loader /> : "Renew Subscription"}
          </Button>
        ) : (
          <Button
            onClick={handleSubscribe}
            disabled={isLoading}
            className={cn(
              "h-11 w-full rounded-xl text-base font-semibold transition-all",
              popularPlan &&
                "bg-amber-500 text-black shadow-sm shadow-amber-300/40 hover:bg-amber-600",
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
        )}
      </CardFooter>
    </Card>
  );
};

export default PlanCard;
