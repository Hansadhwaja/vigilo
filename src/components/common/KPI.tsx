import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { classNames } from "../../utils/helpers";

interface KPIProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  trend?: "up" | "down";
  urgent?: boolean;
}

export default function KPI({ icon, label, value, sub, trend, urgent }: KPIProps) {
  return (
    <Card className={classNames(
      "relative overflow-hidden transition-all duration-200",
      urgent && "border-red-200 bg-red-50"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={classNames(
          "text-sm font-medium",
          urgent && "text-red-700"
        )}>
          {label}
        </CardTitle>
        <div className={classNames(
          "p-2 rounded-lg",
          urgent ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
        )}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={classNames(
          "text-3xl font-bold",
          urgent && "text-red-700"
        )}>
          {value}
        </div>
        {sub && (
          <div className="flex items-center gap-1 mt-1">
            {trend === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
            {trend === "down" && <TrendingDown className="h-3 w-3 text-red-600" />}
            <p className={classNames(
              "text-xs",
              urgent ? "text-red-600" : "text-gray-500"
            )}>
              {sub}
            </p>
          </div>
        )}
        {urgent && (
          <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-red-500"></div>
        )}
      </CardContent>
    </Card>
  );
}