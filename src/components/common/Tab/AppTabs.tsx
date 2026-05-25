"use client";

import { ReactNode } from "react";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import { cn } from "@/lib/utils";

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

    contentClassName?: string;
}

const AppTabs = ({
    defaultValue,
    value,
    onValueChange,
    tabs,
    className = "",
    tabsListClassName = "",
    contentClassName = "",
}: AppTabsProps) => {
    return (
        <Tabs
            defaultValue={defaultValue}
            value={value}
            onValueChange={onValueChange}
            className={cn(
                "flex h-full min-h-0 flex-col gap-4",
                className
            )}
        >
            <TabsList
                className={cn(
                    `
                    shrink-0
                    min-h-14
                    rounded-full
                    border
                    border-slate-200
                    bg-linear-to-r
                    from-orange-50
                    via-white
                    to-sky-50
                    p-1.5
                    shadow-sm
                    `,
                    tabsListClassName
                )}
            >
                {tabs.map((tab) => (
                    <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className={cn(
                            `
                            min-w-35
                            rounded-full
                            px-6
                            py-2.5
                            text-sm
                            font-semibold
                            text-slate-600
                            transition-all
                            duration-300
                            data-[state=active]:text-white
                            data-[state=active]:shadow-md
                            `,
                            tab.activeColor ||
                            "data-[state=active]:bg-orange-500"
                        )}
                    >
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>

            {tabs.map((tab) => (
                <TabsContent
                    key={tab.value}
                    value={tab.value}
                    className={cn(
                        `
                        mt-0
                        flex-1
                        min-h-0
                        overflow-hidden
                        `,
                        contentClassName
                    )}
                >
                    {tab.content}
                </TabsContent>
            ))}
        </Tabs>
    );
};

export default AppTabs;