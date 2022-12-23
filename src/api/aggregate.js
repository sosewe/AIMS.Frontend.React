import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getAllAggregates = async () => {
  return await axios.get(`${apiRoutes.aggregate}`);
};
