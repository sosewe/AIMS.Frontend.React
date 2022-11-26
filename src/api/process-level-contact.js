import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newProcessLevelContact = async (values) => {
  return await axios.post(apiRoutes.processLevelContact, values);
};
