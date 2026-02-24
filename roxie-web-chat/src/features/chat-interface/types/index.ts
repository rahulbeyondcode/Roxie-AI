type Message = {
  id: string;
  messageType: "user" | "llm";
  message: string;
  time: Date;
};

export type MessageStoreType = {
  sessionId: string;
  allMessages: Message[];
  isSendingMessage: boolean;
  isLoadingGreeting: boolean;
  sendNewMessage: (message: SendMessagePayloadType) => void;
  fetchGreeting: () => Promise<void>;
};

export type SendMessagePayloadType = {
  query: string;
  thread_id: string;
};

export type LLMResponseType = {
  message: string;
};
