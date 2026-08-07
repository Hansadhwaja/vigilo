
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ComponentProps } from "react";

interface Props extends Omit<ComponentProps<typeof Input>, "onChange"> {
  Icon: LucideIcon;
  className?: string;
  inputClassName?: string;
  onChange: (value: string) => void;
}

const IconInput = ({
  Icon,
  placeholder = "Search expenses...",
  value,
  className,
  inputClassName,
  onChange,
  ...props
}: Props) => {
  return (
    <div className={cn("relative", className)}>
      <Icon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        {...props}
        placeholder={placeholder}
        className={cn("rounded-xl pl-9", inputClassName)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default IconInput;

