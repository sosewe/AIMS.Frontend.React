import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getDisaggregate = async ({ queryKey }) => {
  const [, disaggregateId] = queryKey;
  return await axios.get(`${apiRoutes.disaggregate}/${disaggregateId}`);
};

export const getAllDisaggregates = async () => {
  return await axios.get(`${apiRoutes.disaggregate}`);
};

export const getAllDisaggregatesByLevel = async ({ queryKey }) => {
  const [, level] = queryKey;
  return await axios.get(
    `${apiRoutes.disaggregate}/GetDisaggregatesByLevel/${level}`
  );
};

export const newDisAggregate = async (values) => {
  return await axios.post(`${apiRoutes.disaggregate}`, values);
};

export const deleteDisAggregateById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.disaggregate}/${id}`);
};
