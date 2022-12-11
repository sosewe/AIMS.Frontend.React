import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newOfficeInvolvedProcessLevel = async (values) => {
  return await axios.post(apiRoutes.officeInvolved, values);
};
