import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newInnovationChallenge = async (values) => {
  return await axios.post(apiRoutes.innovationChallenge, values);
};
