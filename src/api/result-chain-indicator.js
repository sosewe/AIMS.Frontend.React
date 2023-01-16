import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const saveResultChainIndicator = async (values) => {
  return await axios.post(`${apiRoutes.resultChainIndicator}`, values);
};
