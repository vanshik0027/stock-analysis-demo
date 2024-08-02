// services/api.js

import axios from "axios";

const API_BASE_URL = "https://raw.githubusercontent.com/mockoon/mock-samples/main/mock-apis/data/1forgecom.json"; // Backend URL

export const fetchStockData = async () => {
  const response = await axios.get(`${API_BASE_URL}`);
  return response.data;
};



