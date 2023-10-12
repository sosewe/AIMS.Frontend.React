import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getPages = async () => {
  return await axios.get(`${apiRoutes.page}`);
};

export const getPage = async ({ queryKey }) => {
  const [_, pageId] = queryKey;
  return await axios.get(`${apiRoutes.page}/${pageId}`);
};

export const getPagesByModuleId = async ({ queryKey }) => {
  const [_, moduleId] = queryKey;
  return await axios.get(`${apiRoutes.page}/GetPagesByModuleId/${moduleId}`);
};

export const newPage = async (values) => {
  return await axios.post(apiRoutes.page, values);
};

export const deletePage = async ({ queryKey }) => {
  const [_, pageId] = queryKey;
  return await axios.delete(`${apiRoutes.page}/${pageId}`);
};
