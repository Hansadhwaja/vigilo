import { Switch } from "@/components/ui/switch";

interface SettingToggleProps {
    title: string;
    description: string;
    defaultChecked?: boolean;
}

export const SettingToggle = ({
    title,
    description,
    defaultChecked,
}: SettingToggleProps) => {
    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="font-medium">{title}</p>
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            </div>
            <Switch defaultChecked={defaultChecked} />
        </div>
    );
};