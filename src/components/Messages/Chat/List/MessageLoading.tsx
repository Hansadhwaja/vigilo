import { MessageCircleMore } from "lucide-react";

const MessageLoading = () => {
    return (
        <div className="flex flex-1 items-center justify-center px-6">
            <div className="relative flex flex-col items-center text-center">
                {/* Background Glow */}
                <div className="absolute h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

                {/* Icon */}
                <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-100 bg-white shadow-xl shadow-emerald-100/50">
                    <MessageCircleMore className="h-9 w-9 text-emerald-500" />
                </div>

                {/* Text */}
                <h3 className="text-base font-semibold text-slate-800">
                    Loading Messages
                </h3>

                <p className="mt-1 max-w-[240px] text-sm leading-relaxed text-slate-500">
                    Syncing conversation history and preparing your secure chat.
                </p>

                {/* Animated Dots */}
                <div className="mt-4 flex items-center gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500" />
                </div>
            </div>
        </div>
    );
};

export default MessageLoading;