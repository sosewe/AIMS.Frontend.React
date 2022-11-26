import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newProcessLevelRole = async (values) => {
  return await axios.post(apiRoutes.processLevelRole, values);
};
