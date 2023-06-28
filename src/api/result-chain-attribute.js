import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const saveResultChainAttributes = async (values) => {
  return await axios.post(`${apiRoutes.resultChainAttribute}`, values);
};

export const getResultChainAttributeByIndicatorId = async ({ queryKey }) => {
  const [, resultChainIndicatorId] = queryKey;
  return await axios.get(
    `${apiRoutes.resultChainAttribute}/GetResultChainAttributeByIndicatorId/${resultChainIndicatorId}`
  );
};

export const deleteResultChainById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.resultChainAttribute}/${id}`);
};
