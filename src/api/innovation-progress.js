import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newInnovationProgress = async (values) => {
  return await axios.post(apiRoutes.innovationProgress, values);
};
