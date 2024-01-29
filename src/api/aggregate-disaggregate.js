import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getAllAggregateDisaggregates = async () => {
  return await axios.get(`${apiRoutes.aggregateDisaggregate}`);
};

export const getAggregateDisaggregates = async ({ queryKey }) => {
  const [, aggregateId] = queryKey;
  return await axios.get(
    `${apiRoutes.aggregateDisaggregate}/GetAggregateDisAggregateByAggregateId/${aggregateId}`
  );
};

export const getParentAggregateDisAggregateByAggregateId = async ({
  queryKey,
}) => {
  const [, aggregateId] = queryKey;
  return await axios.get(
    `${apiRoutes.aggregateDisaggregate}/GetParentAggregateDisAggregateByAggregateId/${aggregateId}`
  );
};

export const aggregateDisaggregateConfig = async (values) => {
  return await axios.post(
    `${apiRoutes.aggregateDisaggregate}/AggregateDisaggregateConfig`,
    values
  );
};

export const aggregateDisaggregateById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.aggregateDisaggregate}/${id}`);
};

export const deleteAggregateDisaggregateById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.aggregateDisaggregate}/${id}`);
};
