import {
    Clock3,
    MessageCircle,
    ShieldCheck,
    Sparkles,
    UserRound,
    Wifi,
} from "lucide-react";

const EmptyConversion = () => {
    return (
        <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50/70 via-background to-teal-50/50">
            {/* ambient glow */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 right-[-120px] h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />

                <div className="absolute bottom-[-140px] left-[-80px] h-72 w-72 rounded-full bg-teal-300/20 blur-3xl" />

                <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-100/30 blur-3xl" />
            </div>

            {/* content */}
            <div className="relative z-10 flex max-w-md flex-col items-center px-8 text-center">
                {/* icon section */}
                <div className="relative mb-8">
                    {/* outer glow */}
                    <div className="absolute inset-0 scale-125 rounded-full bg-emerald-400/10 blur-2xl" />

                    {/* main icon */}
                    <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/70 bg-white/90 shadow-2xl shadow-emerald-100 backdrop-blur-xl">
                        <MessageCircle className="h-12 w-12 text-emerald-500" />
                    </div>

                    {/* top badge */}
                    <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/60 bg-emerald-500 shadow-lg shadow-emerald-300/30">
                        <ShieldCheck className="h-5 w-5 text-white" />
                    </div>

                    {/* bottom badge */}
                    <div className="absolute -bottom-2 -left-2 flex h-9 w-9 items-center justify-center rounded-2xl border border-white/60 bg-teal-500 shadow-lg shadow-teal-300/30">
                        <UserRound className="h-4 w-4 text-white" />
                    </div>

                    {/* sparkle */}
                    <div className="absolute right-5 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md">
                        <Sparkles className="h-3 w-3 text-amber-500" />
                    </div>
                </div>

                {/* title */}
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                    Start a conversation
                </h2>

                {/* description */}
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Select a guard from the sidebar to
                    open a secure real-time conversation
                    and manage communications instantly.
                </p>

                {/* feature pills */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />

                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>

                        Live presence active
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
                        <Clock3 size={13} />

                        Message receipts enabled
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 shadow-sm">
                        <Wifi size={13} />

                        Real-time sync
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmptyConversion;