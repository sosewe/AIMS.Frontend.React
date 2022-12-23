import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newAMREFEntity = async (values) => {
  return await axios.post(apiRoutes.amrefEntity, values);
};

export const getAmrefEntities = async () => {
  return await axios.get(apiRoutes.amrefEntity);
};

export const getEntity = async ({ queryKey }) => {
  const [, entityId] = queryKey;
  return await axios.get(`${apiRoutes.amrefEntity}/${entityId}`);
};

export const getEntityTypeId = async ({ queryKey }) => {
  const [, entityTypeId] = queryKey;
  return await axios.get(`${apiRoutes.amrefEntity}/entityType/${entityTypeId}`);
};

export const deleteEntity = async ({ queryKey }) => {
  const [, entityId] = queryKey;
  return await axios.delete(`${apiRoutes.amrefEntity}/delete/${entityId}`);
};
