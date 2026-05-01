import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Props {
  data: any[];
}

const RevenueTrendChart = ({ data }: Props) => {
  return (
    <Card className="xl:col-span-2">
      <CardHeader>
        <CardTitle>Revenue & Operations Trend</CardTitle>
        <CardDescription>
          Daily performance metrics with financial data
        </CardDescription>
      </CardHeader>

      <CardContent className="h-80 w-full p-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />

            <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />

            <YAxis yAxisId="left" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />

            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />

            <Tooltip />

            <Line yAxisId="left" type="monotone" dataKey="incidents" stroke="#6366f1" strokeWidth={2} dot={false} />
            <Line yAxisId="left" type="monotone" dataKey="alarms" stroke="#f59e0b" strokeWidth={2} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} dot={false} />

          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueTrendChart;