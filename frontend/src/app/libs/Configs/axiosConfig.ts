import axios from "axios";
import { env } from "../../../config/env";

const API_URL = env.REACT_APP_API_URL;
const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true,
});

export default apiClient;
