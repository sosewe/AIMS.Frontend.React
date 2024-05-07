import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const saveResultChainAggregate = async (resultChainAggregate) => {
  return await axios.post(
    `${apiRoutes.resultChainAggregate}`,
    resultChainAggregate
  );
};

export const getResultChainAggregate = async ({ queryKey }) => {
  const [, resultChainAggregateId] = queryKey;
  return await axios.get(
    `${apiRoutes.resultChainAggregate}/${resultChainAggregateId}`
  );
};

export const getResultChainAggregateByResultChainIndicatorId = async ({
  queryKey,
}) => {
  const [, resultChainIndicatorId] = queryKey;
  return await axios.get(
    `${apiRoutes.resultChainAggregate}/GetResultChainAggregateByResultChainIndicatorId/${resultChainIndicatorId}`
  );
};

export const deleteResultChainAggregateById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.resultChainAggregate}/${id}`);
};
