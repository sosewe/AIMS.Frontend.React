import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getLookupOptionsById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.lookupOption}/optionsById/${id}`);
};
