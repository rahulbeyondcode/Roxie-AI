import { create } from "zustand";
import { generateRandomString } from "../../../helpers/utils";
import { sendMessageAPI } from "../api";
import type { MessageStoreType } from "../types";

const useMessageStore = create<MessageStoreType>((set) => ({
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

      if (response.data.message) {
        set((state) => ({
          isSendingMessage: false,
          allMessages: [
            ...(state?.allMessages || []),
            {
              id: generateRandomString(6),
              message: response.data.message,
              messageType: "llm",
              time: new Date(),
            },
          ],
        }));
      }
    } catch (err) {
      console.log("err: ", err);
    }
  },
}));

export default useMessageStore;
