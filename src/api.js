import axios from "axios";

const API = axios.create({
  baseURL: "https://event-dashboard-project.onrender.com",
});

export default API;