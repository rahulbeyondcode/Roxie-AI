import { useRef } from "react";

import sendIcon from "../../../../assets/images/send-icon.svg";
import useMessageStore from "../../store";
import type { SendMessagePayloadType } from "../../types";

const ChatInputSection = () => {
  const userMessageRef = useRef<string>("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const sendNewMessage = useMessageStore((state) => state.sendNewMessage);

  const handleSendMessage = () => {
    const finalPayload = {
      query: userMessageRef.current,
      thread_id: "1",
    } as SendMessagePayloadType;

    sendNewMessage(finalPayload);

    console.log("textAreaRef.current: ", textAreaRef.current);
    textAreaRef.current!.value = "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    userMessageRef.current = value;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="h-35 px-7 pb-3 flex items-center">
      <textarea
        spellCheck={false}
        ref={textAreaRef}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your query here..."
        className="h-full grow rounded-lg py-2 px-3 outline-0 backdrop-opacity-35 mr-2"
      />
      <button
        className="rounded-full h-[50px] w-[50px] flex justify-center items-center cursor-pointer backdrop-opacity-35"
        onClick={handleSendMessage}
      >
        <img src={sendIcon} alt="" width="30px" height="30px" />
      </button>
    </div>
  );
};

export default ChatInputSection;
