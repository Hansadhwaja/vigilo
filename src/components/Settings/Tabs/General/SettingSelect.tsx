import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SettingSelectProps {
    label: string;
    defaultValue: string;
    options: {
        label: string;
        value: string;
    }[];
}

export const SettingSelect = ({
    label,
    defaultValue,
    options,
}: SettingSelectProps) => {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">
                {label}
            </label>

            <Select defaultValue={defaultValue}>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>

                <SelectContent>
                    {options.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};