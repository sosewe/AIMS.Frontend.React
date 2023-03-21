import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newAdvocacyProgress = async (values) => {
  return await axios.post(apiRoutes.advocacyProgress, values);
};
