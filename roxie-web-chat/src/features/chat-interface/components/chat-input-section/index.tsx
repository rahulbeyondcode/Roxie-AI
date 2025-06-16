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
    textAreaRef.current!.style.height = "auto"; // reset first
    textAreaRef.current!.style.height =
      Math.min(textAreaRef.current!.scrollHeight, 120) + "px";

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-35 px-7 pb-6 flex items-center bg-resd-400">
      <textarea
        spellCheck={false}
        ref={textAreaRef}
        disabled={isSendingMessage}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Ask something here..."
        className={`max-h-[120px] overflow-auto resize-none grow rounded-3xl px-4 pt-3 min outline-0 mr-2 ${
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
            className="rounded-[47px] bg-[linear-gradient(145deg,_#f3f5ff,_#cccedd)] shadow-[5px_5px_6px_#81838c,-5px_-5px_6px_#ffffff] px-6 py-2 h-[45px] w-[45px] flex justify-center items-center cursor-pointer backdrop-opacity-35"
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
