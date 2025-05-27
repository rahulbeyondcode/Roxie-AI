import { useCallback, useEffect, useRef } from "react";
import Markdown from "react-markdown";

import Spinner from "../../../../assets/components/Spinner";
import roxieImage from "../../../../assets/images/Roxie_no_bg.png";
import userIcon from "../../../../assets/images/user-icon.svg";
import useMessageStore from "../../store";

const AssistantMessage = ({ message }: { message: string }) => {
  return (
    <div className="mx-7 my-2 flex">
      <div className="bg-black mt-2 rounded-full w-[25px] h-[25px] overflow-hidden">
        <img src={roxieImage} alt="assistant_image" height={20} width={20} />
      </div>
      <div className="max-w-3/4 mx-2 px-4 py-2 rounded-lg backdrop-opacity-75">
        <p className="llm_message">
          <Markdown>{message}</Markdown>
        </p>
      </div>
    </div>
  );
};

const HumanMessage = ({ message }: { message: string }) => {
  return (
    <div className="mx-7 my-2 flex justify-end">
      <div className="bg-black mt-2 rounded-full w-[25px] h-[25px] flex justify-center items-center">
        <img src={userIcon} alt="assistant_image" height={15} width={15} />
      </div>

      <div className="max-w-3/4 mx-2 px-4 py-2 rounded-lg backdrop-opacity-75">
        <p>{message}</p>
      </div>
    </div>
  );
};

const ChatMessagesContainer = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const allMessages = useMessageStore((state) => state.allMessages);
  const isSendingMessage = useMessageStore((state) => state.isSendingMessage);

  console.log("allMessages: ", allMessages);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [allMessages, scrollToBottom]);

  return (
    <div className="h-full flex flex-col py-4 overflow-y-auto">
      {(allMessages || [])?.map((msgObject) => {
        if (msgObject?.messageType === "llm") {
          return (
            <AssistantMessage
              key={msgObject?.id}
              message={msgObject?.message}
            />
          );
        }
        return (
          <HumanMessage key={msgObject?.id} message={msgObject?.message} />
        );
      })}

      {isSendingMessage ? (
        <div className="self-center flex justify-center items-center mt-10">
          <Spinner />
        </div>
      ) : (
        ""
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessagesContainer;
