import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newAdvocacyPartner = async (values) => {
  return await axios.post(apiRoutes.advocacyPartner, values);
};
