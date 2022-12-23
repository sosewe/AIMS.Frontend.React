import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getProjects = async () => {
  return await axios.get(apiRoutes.project);
};

export const newProject = async (values) => {
  return await axios.post(apiRoutes.project, values);
};

export const getProjectById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(apiRoutes.project + "/" + id);
};
