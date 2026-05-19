import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

interface CustomHeaderProps {
    title: string;
    description: string;
    previousLink?: string;
    others?: React.ReactNode;
}

const CustomHeader = ({
    title,
    description,
    previousLink,
    others,
}: CustomHeaderProps) => {
    return (
        <div className="space-y-4 rounded-3xl border border-slate-200/70 bg-linear-to-r from-orange-50 via-white to-sky-50 p-5 shadow-sm">
            {previousLink && (
                <Button
                    variant="ghost"
                    asChild
                    className="w-fit rounded-xl text-slate-600 hover:bg-white hover:text-orange-500"
                >
                    <Link to={previousLink}>
                        <ArrowLeft className="size-4" />
                        Back
                    </Link>
                </Button>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        {title}
                    </h1>

                    <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
                        {description}
                    </p>
                </div>

                {others && (
                    <div className="flex items-center gap-2 max-sm:w-full max-sm:flex-wrap">
                        {others}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomHeader;