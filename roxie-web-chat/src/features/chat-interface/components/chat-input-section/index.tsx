import { useEffect, useRef } from "react";

import Spinner from "../../../../assets/components/Spinner";
import sendIcon from "../../../../assets/images/send-icon.svg";
import useMessageStore from "../../store";
import type { SendMessagePayloadType } from "../../types";

const ChatInputSection = () => {
  const userMessageRef = useRef<string>("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const sendNewMessage = useMessageStore((state) => state.sendNewMessage);
  const isSendingMessage = useMessageStore((state) => state.isSendingMessage);
  const sessionId = useMessageStore((state) => state.sessionId);

  useEffect(() => {
    textAreaRef.current!.focus();
  }, [isSendingMessage]);

  const handleSendMessage = () => {
    const finalPayload = {
      query: userMessageRef.current,
      thread_id: sessionId,
    } as SendMessagePayloadType;

    if (userMessageRef.current.trim()) {
      sendNewMessage(finalPayload);
    }

    textAreaRef.current!.value = "";
    userMessageRef.current = "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    userMessageRef.current = value;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-35 px-7 pb-3 flex items-center">
      <textarea
        spellCheck={false}
        ref={textAreaRef}
        disabled={isSendingMessage}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your query here..."
        className={`h-full grow rounded-lg py-2 px-3 outline-0 mr-2 ${
          isSendingMessage
            ? "cursor-not-allowed backdrop-opacity-15"
            : "backdrop-opacity-45"
        }`}
      />
      <div className="h-[50px] w-[50px] flex justify-center items-center">
        {isSendingMessage ? (
          <button>
            <Spinner />
          </button>
        ) : (
          <button
            className="rounded-full h-[45px] w-[45px] flex justify-center items-center cursor-pointer backdrop-opacity-35"
            onClick={handleSendMessage}
          >
            <img
              src={sendIcon}
              className="ml-1"
              alt=""
              width="20px"
              height="20px"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatInputSection;
