import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Props {
  Icon: LucideIcon;
  placeholder?: string;
  value: string;
  className?: string;
  inputClassName?: string;
  onChange: (v: string) => void;
}

const IconInput = ({
  Icon,
  placeholder = "Search expenses...",
  value,
  className,
  inputClassName,
  onChange,
}: Props) => {
  return (
    <div className={cn("relative", className)}>
      <Icon
        size={16}
        className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
      />

      <Input
        placeholder={placeholder}
        className={cn("rounded-xl pl-9", inputClassName)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default IconInput;
