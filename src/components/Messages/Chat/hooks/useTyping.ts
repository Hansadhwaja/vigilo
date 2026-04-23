import { useRef } from "react";

export const useTyping = (socketRef: any, conversationId: string) => {
    const timeoutRef = useRef<number | null>(null);
    const canEmitRef = useRef(true);

    const handleTyping = (value: string) => {
        if (!socketRef.current || !conversationId) return;

        if (value.trim()) {
            if (canEmitRef.current) {
                socketRef.current.emit("typing", { conversationId });
                canEmitRef.current = false;
            }

            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            timeoutRef.current = window.setTimeout(() => {
                socketRef.current.emit("stopTyping", { conversationId });
                canEmitRef.current = true;
            }, 1500);
        } else {
            socketRef.current.emit("stopTyping", { conversationId });
            canEmitRef.current = true;
        }
    };

    return { handleTyping };
};