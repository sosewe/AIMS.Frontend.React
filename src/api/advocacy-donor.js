import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newAdvocacyDonor = async (values) => {
  return await axios.post(apiRoutes.advocacyDonor, values);
};
