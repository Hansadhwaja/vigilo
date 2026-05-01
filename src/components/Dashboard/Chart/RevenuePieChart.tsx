import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Props {
  data: any[];
}

const RevenuePieChart = ({ data }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Distribution</CardTitle>
        <CardDescription>Current month breakdown</CardDescription>
      </CardHeader>

      <CardContent className="h-80 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip />

          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenuePieChart;