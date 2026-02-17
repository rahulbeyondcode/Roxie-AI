import axios from "axios";

import { AGENT_EMBEDDING_PORT } from "./config";

const fetchEmbeddings = async (text: string): Promise<number[] | null> => {
  try {
    const res = await axios.post(
      `http://${process.env.EMBEDDER_HOST}:${AGENT_EMBEDDING_PORT}/embed`,
      { text }
    );
    return res?.data?.embedding ?? null;
  } catch (err) {
    console.error("Embedding fetch error:", err);
    return null;
  }
};

export default fetchEmbeddings;
