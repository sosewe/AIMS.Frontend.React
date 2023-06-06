import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getProjects = async ({ queryKey }) => {
  const [, page, pageSize, filterModel] = queryKey;
  return await axios.post(
    `${apiRoutes.project}/GetProjects?PageNumber=${page}&PageSize=${pageSize}`,
    filterModel.items
  );
};

export const newProject = async (values) => {
  return await axios.post(apiRoutes.project, values);
};

export const getProjectById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(apiRoutes.project + "/" + id);
};

export const getProjectIndicators = async ({ queryKey }) => {
  const [, projectId] = queryKey;
  return await axios.get(`${apiRoutes.project}/ProjectIndicators/${projectId}`);
};
