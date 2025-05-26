import axios from "axios";

const APIClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_ENDPOINT}/api`,
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer your-auth-token",
  },
});

export default APIClient;
