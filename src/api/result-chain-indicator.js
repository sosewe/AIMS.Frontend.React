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
