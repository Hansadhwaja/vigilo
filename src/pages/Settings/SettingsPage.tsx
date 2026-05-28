
import SettingsTabs from "@/components/Settings/Tabs/SettingsTabs";

interface SettingsPageProps {
  usageAlarmsMTD: number;
}

export default function SettingsPage({ usageAlarmsMTD }: SettingsPageProps) {

  return (
    <div className="space-y-6 overflow-y-auto min-w-0 min-h-0 h-full no-scrollbar">
      <SettingsTabs />
    </div>
  );
}