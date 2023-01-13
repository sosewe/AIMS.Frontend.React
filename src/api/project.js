import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getProjects = async ({ queryKey }) => {
  const [, page, pageSize] = queryKey;
  return await axios.get(
    `${apiRoutes.project}?MaxPageSize=${pageSize}&PageNumber=${page}&PageSize=${pageSize}`
  );
};

export const newProject = async (values) => {
  return await axios.post(apiRoutes.project, values);
};

export const getProjectById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(apiRoutes.project + "/" + id);
};
