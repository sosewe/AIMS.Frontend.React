import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const saveResultChainAggregate = async (resultChainAggregate) => {
  return await axios.post(
    `${apiRoutes.resultChainAggregate}`,
    resultChainAggregate
  );
};
