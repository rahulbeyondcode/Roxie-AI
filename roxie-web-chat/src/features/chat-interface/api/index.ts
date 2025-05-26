import type { AxiosResponse } from "axios";
import APIClient from "../../../helpers/api";
import type { LLMResponseType, SendMessagePayloadType } from "../types";

type SendMessageAPIType = (
  payload: SendMessagePayloadType
) => Promise<AxiosResponse<LLMResponseType>>;

export const sendMessageAPI: SendMessageAPIType = (payload) => {
  return APIClient.post("/ask", payload);
};
