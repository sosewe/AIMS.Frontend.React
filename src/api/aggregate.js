import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getAllAggregates = async () => {
  return await axios.get(`${apiRoutes.aggregate}`);
};

export const getAggregatesByName = async ({ queryKey }) => {
  const [, name] = queryKey;
  return await axios.get(`${apiRoutes.aggregate}/GetByName/${name}`);
};
