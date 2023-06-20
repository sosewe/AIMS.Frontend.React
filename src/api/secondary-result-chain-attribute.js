import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newSecondaryResultChainAttribute = async (values) => {
  return await axios.post(apiRoutes.secondaryResultChainAttribute, values);
};
