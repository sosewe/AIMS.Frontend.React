import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getProjectRoles = async () => {
  return await axios.get(apiRoutes.projectRole);
};

export const deleteProjectRoleById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.projectRole}/${id}`);
};

export const getProjectRoleById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.projectRole}/GetProjectRoleById/${id}`);
};

export const newProjectRole = async (values) => {
  return await axios.post(apiRoutes.projectRole, values);
};
