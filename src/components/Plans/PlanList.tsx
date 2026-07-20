"use client";

import PlanCard from "./PlanCard";
import type { Plan } from "@/types";
import PlanListSkeleton from "./Skeleton/PlanListSkeleton";
import { useGetPlansQuery } from "@/store/apis/plansApi";

const PlanList = () => {
  const { data, isLoading } = useGetPlansQuery({
    isActive: true,
  });
  const plans = data?.data ?? [];

  if (isLoading) return <PlanListSkeleton />;

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
      {plans.map((plan: Plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
};

export default PlanList;
