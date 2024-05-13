import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newOrganizationUnit = async (values) => {
  return await axios.post(apiRoutes.organizationUnit, values);
};

export const getOrganizationUnits = async () => {
  return await axios.get(apiRoutes.organizationUnit);
};

export const getOrganizationUnitByEntityType = async ({ queryKey }) => {
  const [, entityTypeId] = queryKey;
  return await axios.get(
    `${apiRoutes.organizationUnit}/GetOrganizationUnitByEntityType/${entityTypeId}`
  );
};

export const getOrganizationUnitById = async ({ queryKey }) => {
  const [, organisationUnitId] = queryKey;
  return await axios.get(`${apiRoutes.organizationUnit}/${organisationUnitId}`);
};

export const deleteOrganizationUnit = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.organizationUnit}/${id}`);
};

export const getOrganizationUnit = async ({ queryKey }) => {
  const [, officeName] = queryKey;
  return await axios.get(
    `${apiRoutes.organizationUnit}/GetOrganizationUnit/${officeName}`
  );
};
