import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newProcessLevelCostCentre = async (values) => {
  return await axios.post(apiRoutes.processLevelCostCentre, values);
};
