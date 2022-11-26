import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newDonorProcessLevel = async (values) => {
  return await axios.post(apiRoutes.donorProcessLevel, values);
};
