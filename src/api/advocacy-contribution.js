import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newAdvocacyContribution = async (values) => {
  return await axios.post(apiRoutes.advocacyContribution, values);
};
