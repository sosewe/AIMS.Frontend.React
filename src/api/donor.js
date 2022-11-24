import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getDonors = async () => {
  return await axios.get(apiRoutes.donor);
};
