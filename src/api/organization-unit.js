import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getOrganizationUnits = async () => {
  return await axios.get(apiRoutes.organizationUnit);
};
