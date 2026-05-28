import { RotateCcw, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface SettingToggleProps {
  title: string;
  description: string;
  defaultChecked?: boolean;
}

const SettingToggle = ({
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

interface SettingSelectProps {
  label: string;
  defaultValue: string;
  options: {
    label: string;
    value: string;
  }[];
}

const SettingSelect = ({
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

const notificationSettings = [
  {
    title: "Email notifications",
    description: "Receive alerts via email",
    defaultChecked: true,
  },
  {
    title: "SMS alerts",
    description: "Critical incidents only",
  },
  {
    title: "Push notifications",
    description: "Mobile app notifications",
    defaultChecked: true,
  },
  {
    title: "Sound alerts",
    description: "Audio notifications for critical alarms",
    defaultChecked: true,
  },
];

const operationSettings = [
  {
    title: "Auto-assign alarms",
    description: "Based on proximity and availability",
    defaultChecked: true,
  },
  {
    title: "Auto-escalate overdue alarms",
    description: "Escalate after SLA threshold",
    defaultChecked: true,
  },
  {
    title: "Real-time tracking",
    description: "GPS tracking for all guards",
    defaultChecked: true,
  },
];

const GeneralTab = () => {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>
            Notifications
          </CardTitle>
          <CardDescription>
            Configure how you receive alerts and updates
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {notificationSettings.map(
            (setting) => (
              <SettingToggle
                key={setting.title}
                {...setting}
              />
            )
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Operation Defaults
          </CardTitle>
          <CardDescription>
            Configure system behavior and automation
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {operationSettings.map(
            (setting) => (
              <SettingToggle
                key={setting.title}
                {...setting}
              />
            )
          )}

          <SettingSelect
            label="Default SLA (minutes)"
            defaultValue="15"
            options={[
              {
                value: "10",
                label: "10 minutes",
              },
              {
                value: "15",
                label: "15 minutes",
              },
              {
                value: "20",
                label: "20 minutes",
              },
              {
                value: "30",
                label: "30 minutes",
              },
            ]}
          />
        </CardContent>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>
            Regional Settings
          </CardTitle>
          <CardDescription>
            Configure timezone, currency, and locale settings
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <SettingSelect
              label="Timezone"
              defaultValue="australia/melbourne"
              options={[
                {
                  value:
                    "australia/melbourne",
                  label:
                    "Australia/Melbourne",
                },
                {
                  value:
                    "australia/sydney",
                  label:
                    "Australia/Sydney",
                },
                {
                  value:
                    "australia/perth",
                  label:
                    "Australia/Perth",
                },
                {
                  value:
                    "pacific/auckland",
                  label:
                    "Pacific/Auckland",
                },
              ]}
            />

            <SettingSelect
              label="Currency"
              defaultValue="aud"
              options={[
                {
                  value: "aud",
                  label:
                    "AUD (Australian Dollar)",
                },
                {
                  value: "nzd",
                  label:
                    "NZD (New Zealand Dollar)",
                },
                {
                  value: "usd",
                  label:
                    "USD (US Dollar)",
                },
              ]}
            />

            <SettingSelect
              label="Date Format"
              defaultValue="dd/mm/yyyy"
              options={[
                {
                  value:
                    "dd/mm/yyyy",
                  label:
                    "DD/MM/YYYY",
                },
                {
                  value:
                    "mm/dd/yyyy",
                  label:
                    "MM/DD/YYYY",
                },
                {
                  value:
                    "yyyy-mm-dd",
                  label:
                    "YYYY-MM-DD",
                },
              ]}
            />
          </div>

          <div className="pt-6 flex flex-wrap gap-2">
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>

            <Button variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralTab;