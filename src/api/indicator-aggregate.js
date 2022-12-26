import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const saveIndicatorAggregates = async (values) => {
  return await axios.post(`${apiRoutes.indicatorAggregate}`, values);
};
