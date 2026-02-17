import axios from "axios";

import { AGENT_EMBEDDING_PORT } from "./config";

const fetchEmebddings = (text: string) => {
  axios
    .post(`http://${process.env.EMBEDDER_HOST}:${AGENT_EMBEDDING_PORT}/embed`, {
      text,
    })
    .then((res) => {
      console.log("res: ", res?.data?.embedding);
    })
    .catch((err) => {
      console.log("err: ", err);
    });
};

export default fetchEmebddings;
