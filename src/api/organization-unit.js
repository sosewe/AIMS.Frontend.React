import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getOrganizationUnits = async () => {
  return await axios.get(apiRoutes.organizationUnit);
};

export const getOrganizationUnitByEntityType = async ({ queryKey }) => {
  const [_, entityTypeId] = queryKey;
  return await axios.get(
    `${apiRoutes.organizationUnit}/GetOrganizationUnitByEntityType/${entityTypeId}`
  );
};
