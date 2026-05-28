import { Settings } from "lucide-react";

import CustomHeader from "@/components/common/Header/CustomHeader";
import SettingsTabs from "@/components/Settings/Tabs/SettingsTabs";

interface SettingsPageProps {
    usageAlarmsMTD: number;
}

export default function SettingsPage({
    usageAlarmsMTD,
}: SettingsPageProps) {
    return (
        <div className="space-y-6 overflow-y-auto min-w-0 min-h-0 h-full no-scrollbar">
            <CustomHeader
                title="System Settings"
                description="Manage platform configuration, users, security, vehicles, billing, and integrations"
                others={
                    <div
                        className="
                            flex items-center gap-3
                            rounded-2xl border border-orange-100
                            bg-linear-to-r
                            from-orange-50
                            to-sky-50
                            px-5 py-3
                            shadow-sm
                        "
                    >
                        <div
                            className="
                                flex h-11 w-11 items-center
                                justify-center rounded-xl
                                bg-linear-to-br
                                from-orange-500
                                to-sky-500
                                text-white shadow-md
                            "
                        >
                            <Settings className="h-5 w-5" />
                        </div>

                        <div>
                            <p
                                className="
                                    text-xs font-semibold uppercase
                                    tracking-wide text-slate-500
                                "
                            >
                                Platform Settings
                            </p>

                            <p
                                className="
                                    text-sm font-semibold
                                    text-slate-800
                                "
                            >
                                Configuration Center
                            </p>
                        </div>
                    </div>
                }
            />

            <SettingsTabs />
        </div>
    );
}