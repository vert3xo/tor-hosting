import axios from "axios";

export let Axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
