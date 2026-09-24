import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string;
  highlighted?: boolean;
}

const TimeBox = ({ label, value, highlighted = false }: Props) => (
  <Card
    className={cn(
      "p-0 rounded-md",
      highlighted
        ? "border-primary/20 bg-primary/5"
        : "border-border/60 bg-background",
    )}
  >
    <CardContent className="px-3 py-2.5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </CardContent>
  </Card>
);

export default TimeBox;
