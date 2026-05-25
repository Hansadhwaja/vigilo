import { MessageCircleMore, Sparkles, ShieldCheck } from "lucide-react";

interface EmptyMessageProps {
    name: string;
}

const EmptyMessage = ({ name }: EmptyMessageProps) => {
    return (
        <div className="flex flex-1 items-center justify-center px-6">
            <div className="relative flex max-w-sm flex-col items-center text-center">
                {/* Background Glow */}
                <div className="absolute h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />

                {/* Main Icon */}
                <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-[28px] border border-emerald-100 bg-white shadow-2xl shadow-emerald-100/60">
                    <MessageCircleMore className="h-11 w-11 text-emerald-500" />

                    {/* Top Badge */}
                    <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-2xl border border-white bg-emerald-500 shadow-lg shadow-emerald-200">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>

                    {/* Bottom Badge */}
                    <div className="absolute -bottom-2 -left-2 flex h-7 w-7 items-center justify-center rounded-xl border border-white bg-sky-500 shadow-md shadow-sky-200">
                        <ShieldCheck className="h-3.5 w-3.5 text-white" />
                    </div>
                </div>

                {/* Text */}
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    No messages yet
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Start your secure conversation with{" "}
                    <span className="font-semibold text-emerald-600">
                        {name}
                    </span>
                    .
                </p>

                {/* Hint */}
                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-700">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                    Send your first message 👋
                </div>
            </div>
        </div>
    );
};

export default EmptyMessage;