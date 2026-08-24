import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Props {
  data: {
    day: string;
    total: number;
  }[];
}

const chartConfig = {
  total: {
    label: "Patrols Completed",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const PatrolCompletionChart = ({ data }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patrol Completion</CardTitle>
        <CardDescription>Last 7 days</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-100 w-full">
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <Bar
              dataKey="total"
              fill="var(--color-total)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PatrolCompletionChart;
