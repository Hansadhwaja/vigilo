import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";

interface KPIProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  trend?: "up" | "down";
  urgent?: boolean;
  to?: string;
}

export default function KPI({
  icon,
  label,
  value,
  sub,
  trend,
  urgent,
  to,
}: KPIProps) {
  const card = (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
        "border bg-background p-0",
        urgent && "border-red-200 bg-red-50/40"
      )}
    >
      <CardContent className="p-2 md:p-4 space-y-2">

        <CardHeader className="flex items-center justify-between px-0">
          <CardTitle className={cn(
            "text-sm font-medium text-muted-foreground",
            urgent && "text-red-600"
          )}>
            {label}
          </CardTitle>

          <div className={cn(
            "p-2 rounded-md",
            urgent ? "bg-red-100 text-red-600" : "bg-muted text-muted-foreground"
          )}>
            {icon}
          </div>
        </CardHeader>

        <div className={cn(
          "text-lg md:text-2xl font-semibold tracking-tight",
          urgent && "text-red-700"
        )}>
          {value}
        </div>

        {sub && (
          <CardFooter className="flex items-center gap-1 text-xs text-muted-foreground px-0">
            {trend === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
            {trend === "down" && <TrendingDown className="h-3 w-3 text-red-600" />}
            <span>{sub}</span>
          </CardFooter>
        )}

        {urgent && (
          <div className="absolute top-0 right-0 w-0 h-0 border-l-18 border-l-transparent border-t-18 border-t-red-500" />
        )}

      </CardContent>
    </Card>
  );

  return to ? <Link to={to}>{card}</Link> : card;
}