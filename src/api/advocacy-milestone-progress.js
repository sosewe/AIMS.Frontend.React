import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newAdvocacyMilestoneProgress = async (values) => {
  return await axios.post(apiRoutes.advocacyMilestoneProgress, values);
};
