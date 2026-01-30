import axios from "axios";

const instance = axios.create({
  baseURL: "https://todo-web-app-750s.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
