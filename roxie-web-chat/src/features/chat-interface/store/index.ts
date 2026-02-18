import { create } from "zustand";
import { generateRandomString } from "../../../helpers/utils";
import { FALLBACK_LLM_MESSAGE } from "../../../helpers/configs";
import { sendMessageAPI } from "../api";
import type { MessageStoreType } from "../types";

const useMessageStore = create<MessageStoreType>((set) => ({
  sessionId: generateRandomString(5),
  isSendingMessage: false,
  allMessages: [],
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
