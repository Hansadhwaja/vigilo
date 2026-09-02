import { useEffect, useRef } from "react";
import { useSocket } from "@/lib/hooks/useSocket";

interface Props {
  authUserId: string;
  activeConversationId: string;
  refetchMessages: () => unknown;
}

export const useConversationSocket = ({
  authUserId,
  activeConversationId,
  refetchMessages,
}: Props) => {
  const { socketRef, socketConnected } = useSocket();

  const activeConversationRef = useRef(activeConversationId);

  useEffect(() => {
    activeConversationRef.current = activeConversationId;
  }, [activeConversationId]);

  // Message listeners
  useEffect(() => {
    const socket = socketRef.current;

    if (!socket || !socketConnected || !authUserId) {
      return;
    }

    const handleNewMessage = (payload: any) => {
      if (payload?.conversationId === activeConversationRef.current) {
        refetchMessages();
      }
    };

    const handleReceiveMessage = (payload: any) => {
      if (payload?.conversationId === activeConversationRef.current) {
        refetchMessages();

        socket.emit("markSeen", {
          messageId: payload.id,
          conversationId: payload.conversationId,
        });
      }
    };

    const handleMessageUpdated = (payload: any) => {
      if (payload?.conversationId === activeConversationRef.current) {
        refetchMessages();
      }
    };

    const handleMessageDeleted = (payload: any) => {
      if (payload?.conversationId === activeConversationRef.current) {
        refetchMessages();
      }
    };

    const handleMessageSeen = (payload: any) => {
      if (payload?.conversationId === activeConversationRef.current) {
        refetchMessages();
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("messageUpdated", handleMessageUpdated);
    socket.on("messageDeleted", handleMessageDeleted);
    socket.on("messageSeen", handleMessageSeen);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("messageUpdated", handleMessageUpdated);
      socket.off("messageDeleted", handleMessageDeleted);
      socket.off("messageSeen", handleMessageSeen);
    };
  }, [socketConnected, authUserId, refetchMessages, socketRef]);

  // Join active conversation
  useEffect(() => {
    const socket = socketRef.current;

    if (!socket || !socketConnected || !activeConversationId) {
      return;
    }

    console.log("[ConversationSocket] Joining:", activeConversationId);

    socket.emit("joinConversation", activeConversationId);
  }, [activeConversationId, socketConnected, socketRef]);

  return {
    socketRef,
    socketConnected,
    activeConversationRef,
  };
};
