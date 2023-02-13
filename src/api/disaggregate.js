import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getDisaggregate = async ({ queryKey }) => {
  const [, disaggregateId] = queryKey;
  return await axios.get(`${apiRoutes.disaggregate}/${disaggregateId}`);
};
