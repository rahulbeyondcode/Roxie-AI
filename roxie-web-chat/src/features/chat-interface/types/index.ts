type Message = {
  id: string;
  messageType: "user" | "llm";
  message: string;
  time: Date;
};

export type MessageStoreType = {
  allMessages: Message[];
  isSendingMessage: boolean;
  sendNewMessage: (message: SendMessagePayloadType) => void;
};

export type SendMessagePayloadType = {
  query: string;
  thread_id: string;
};

export type LLMResponseType = {
  message: string;
};
