import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const saveResultChainAttributes = async (values) => {
  return await axios.post(`${apiRoutes.resultChainAttribute}`, values);
};
