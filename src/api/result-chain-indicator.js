import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const saveResultChainIndicator = async (values) => {
  return await axios.post(`${apiRoutes.resultChainIndicator}`, values);
};

export const getResultChainIndicatorsByResultChainId = async ({ queryKey }) => {
  const [, resultChainId] = queryKey;
  return await axios.get(
    `${apiRoutes.resultChainIndicator}/GetResultChainIndicatorByResultChainId/${resultChainId}`
  );
};

export const deleteResultChainIndicator = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.resultChainIndicator}/${id}`);
};

export const getResultChainIndicatorByProjectId = async ({ queryKey }) => {
  const [, projectId] = queryKey;
  return await axios.get(
    `${apiRoutes.resultChainIndicator}/GetResultChainIndicatorByProjectId/${projectId}`
  );
};
