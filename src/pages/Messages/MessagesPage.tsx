import EmptyConversion from "@/components/Messages/EmptyConversion";
import LeftSide from "@/components/Messages/LeftSide";
import MessageChatSection from "@/components/Messages/Chat/MessageChatSection";
import { useMessageData } from "@/components/Messages/hook/useMessageData";

const MessagesPage = () => {
  const {
    activeConversationId,
    selectedGuard,
    openingUserId,
    guards,
    isGuardsLoading,
    conversationByUserId,
    presenceMap,
    authUserId,
    isOpeningConversation,

    setEmojiOpen,
    setLivePresenceByUserId,

    openGuardChat,
  } = useMessageData();

  return (
    <div className="flex h-full min-h-0 rounded-2xl border border-gray-200/60 shadow-2xl">
      <LeftSide
        guards={guards}
        isLoading={isGuardsLoading}
        openGuardChat={openGuardChat}
        activeConversationId={activeConversationId}
        selectedGuard={selectedGuard}
        conversationByUserId={conversationByUserId}
        presenceMap={presenceMap}
        openingUserId={openingUserId}
      />

      <section className="flex min-h-0 flex-1 flex-col">
        {selectedGuard ? (
          <MessageChatSection
            activeConversationId={
              activeConversationId
            }
            selectedGuard={selectedGuard}
            authUserId={authUserId}
            isOpeningConversation={
              isOpeningConversation
            }
            presenceMap={presenceMap}
            setLivePresenceByUserId={
              setLivePresenceByUserId
            }
          />
        ) : (
          <EmptyConversion />
        )}
      </section>
    </div>
  );
};

export default MessagesPage;