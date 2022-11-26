import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newImplementingOrganisation = async (values) => {
  return await axios.post(apiRoutes.implementingOrganisation, values);
};
