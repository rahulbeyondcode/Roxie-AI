import ChatInputSection from "./components/chat-input-section";
import ChatMessagesContainer from "./components/chat-messages-container";
import RoxieAvatar from "./components/roxie-avatar-section";

const ChatInterface = () => {
  return (
    <div className="max-h-full chat-card w-[95%] sm:w-5/6 lg:w-1/2 my-10 rounded-xl flex flex-col">
      <RoxieAvatar />
      <ChatMessagesContainer />
      <ChatInputSection />
    </div>
  );
};

export default ChatInterface;
