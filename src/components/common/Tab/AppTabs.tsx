"use client";

import { ReactNode } from "react";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

interface TabItem {
    value: string;
    label: string;
    content: ReactNode;
    activeColor?: string;
}

interface AppTabsProps {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    tabs: TabItem[];
    className?: string;
    tabsListClassName?: string;
}

const AppTabs = ({
    defaultValue,
    value,
    onValueChange,
    tabs,
    className = "",
    tabsListClassName = "",
}: AppTabsProps) => {
    return (
        <Tabs
            defaultValue={defaultValue}
            value={value}
            onValueChange={onValueChange}
            className={`space-y-4 ${className}`}
        >
            <TabsList
                className={`
                    min-h-14 rounded-full border border-slate-200
                    bg-linear-to-r from-orange-50 via-white to-sky-50
                    p-1.5 shadow-sm
                    ${tabsListClassName}
                `}
            >
                {tabs.map((tab) => (
                    <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className={`
                            min-w-35 rounded-full px-6 py-2.5
                            text-sm font-semibold text-slate-600
                            transition-all duration-300
                            data-[state=active]:text-white
                            data-[state=active]:shadow-md
                            ${tab.activeColor || "data-[state=active]:bg-orange-500"}
                        `}
                    >
                        {tab.label}
                    </TabsTrigger>
                ))}

            </TabsList>

            {tabs.map((tab) => (
                <TabsContent
                    key={tab.value}
                    value={tab.value}
                    className="mt-0"
                >
                    {tab.content}
                </TabsContent>
            ))}
        </Tabs>
    );
};

export default AppTabs;