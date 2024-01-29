import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getAllAggregates = async () => {
  return await axios.get(`${apiRoutes.aggregate}`);
};

export const getAggregatesByName = async ({ queryKey }) => {
  const [, name] = queryKey;
  return await axios.get(`${apiRoutes.aggregate}/GetByName/${name}`);
};

export const newAggregate = async (values) => {
  return await axios.post(`${apiRoutes.aggregate}`, values);
};

export const getAggregateById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.aggregate}/${id}`);
};

export const deleteAggregateById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.aggregate}/${id}`);
};
