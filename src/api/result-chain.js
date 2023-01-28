import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getResultChainByObjectiveId = async ({ queryKey }) => {
  const [, objectiveId] = queryKey;
  return await axios.get(
    `${apiRoutes.resultChain}/GetResultChainByResultLevelNameId/${objectiveId}`
  );
};

export const getResultChainByOutcomeId = async ({ queryKey }) => {
  const [, outcomeId] = queryKey;
  return await axios.get(
    `${apiRoutes.resultChain}/GetResultChainByResultLevelNameId/${outcomeId}`
  );
};

export const saveResultChain = async (values) => {
  return await axios.post(`${apiRoutes.resultChain}`, values);
};

export const deleteResultChain = async ({ queryKey }) => {
  const [, resultChainId] = queryKey;
  return await axios.delete(`${apiRoutes.resultChain}/${resultChainId}`);
};
