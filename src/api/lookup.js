import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const useLookupItems = async () => {
  return await axios.get(apiRoutes.lookupItem);
};

export const newLookupItem = async (values) => {
  return await axios.post(apiRoutes.lookupItem, values);
};

export const lookupItem = async ({ queryKey }) => {
  const [_, id] = queryKey;
  return await axios.get(apiRoutes.lookupItem + "/item/" + id);
};
