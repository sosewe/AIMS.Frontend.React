import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newPrimaryResultChainAttribute = async (values) => {
  return await axios.post(apiRoutes.primaryResultChainAttribute, values);
};

export const newSinglePrimaryResultChainAttribute = async (values) => {
  return await axios.post(
    `${apiRoutes.primaryResultChainAttribute}/AddPrimaryResultChain`,
    values
  );
};
