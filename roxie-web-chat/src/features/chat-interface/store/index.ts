import { create } from "zustand";
import { generateRandomString } from "../../../helpers/utils";
import { FALLBACK_LLM_MESSAGE } from "../../../helpers/configs";
import { sendMessageAPI, fetchGreetingAPI } from "../api";
import type { MessageStoreType } from "../types";

let greetingFetched = false;

const useMessageStore = create<MessageStoreType>((set, get) => ({
  sessionId: generateRandomString(5),
  isSendingMessage: false,
  isLoadingGreeting: false,
  allMessages: [],
  fetchGreeting: async () => {
    if (greetingFetched) return;
    greetingFetched = true;

    set({ isLoadingGreeting: true });

    try {
      const response = await fetchGreetingAPI(get().sessionId);

      set((state) => ({
        isLoadingGreeting: false,
        allMessages: [
          ...state.allMessages,
          {
            id: generateRandomString(6),
            message: response?.data?.message || FALLBACK_LLM_MESSAGE,
            messageType: "llm",
            time: new Date(),
          },
        ],
      }));
    } catch (err) {
      console.log("Greeting error: ", err);
      set({ isLoadingGreeting: false });
    }
  },
  sendNewMessage: async (apiPayload) => {
    set((state) => ({
      isSendingMessage: true,
      allMessages: [
        ...(state?.allMessages || []),
        {
          id: generateRandomString(6),
          message: apiPayload?.query,
          messageType: "user",
          time: new Date(),
        },
      ],
    }));

    try {
      const response = await sendMessageAPI(apiPayload);

      set((state) => ({
        isSendingMessage: false,
        allMessages: [
          ...(state?.allMessages || []),
          {
            id: generateRandomString(6),
            message: response?.data?.message || FALLBACK_LLM_MESSAGE,
            messageType: "llm",
            time: new Date(),
          },
        ],
      }));
    } catch (err) {
      console.log("err: ", err);
      set({ isSendingMessage: false });
    }
  },
}));

export default useMessageStore;
