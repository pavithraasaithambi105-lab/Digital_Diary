import axios from "axios";

const API = axios.create({
    baseURL: "https://digital-diary-oj3b.vercel.app",
});

export default API;