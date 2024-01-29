import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const savePermissions = async (values) => {
  return await axios.post(`${apiRoutes.permission}/AddPermissions`, values);
};

export const getByRoleId = async ({ queryKey }) => {
  const [, roleId] = queryKey;
  return await axios.get(`${apiRoutes.permission}/GetByRoleId/${roleId}`);
};

export const getAllRoles = async () => {
  return await axios.get(`${apiRoutes.permission}/GetAllRoles`);
};
