import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newTechnicalAssistanceDonor = async (values) => {
  return await axios.post(apiRoutes.technicalAssistanceDonor, values);
};
