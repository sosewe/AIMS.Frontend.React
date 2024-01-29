import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newLearningDonor = async (values) => {
  return await axios.post(apiRoutes.learningDonor, values);
};
