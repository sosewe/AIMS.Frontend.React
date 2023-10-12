import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getActionsByPageId = async ({ queryKey }) => {
  const [_, pageId] = queryKey;
  return await axios.get(`${apiRoutes.action}/GetActionsByPageId/${pageId}`);
};

export const getAction = async ({ queryKey }) => {
  const [_, actionId] = queryKey;
  return await axios.get(`${apiRoutes.action}/${actionId}`);
};

export const newAction = async (values) => {
  return await axios.post(apiRoutes.action, values);
};

export const deleteAction = async ({ queryKey }) => {
  const [_, actionId] = queryKey;
  return await axios.delete(`${apiRoutes.action}/${actionId}`);
};
