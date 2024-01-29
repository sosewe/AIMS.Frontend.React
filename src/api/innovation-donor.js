import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newInnovationDonor = async (values) => {
  return await axios.post(apiRoutes.innovationDonor, values);
};
