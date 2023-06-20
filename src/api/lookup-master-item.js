import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const saveLookupMasterItem = async (lookupMasterItem) => {
  return await axios.post(`${apiRoutes.lookupMasterItem}`, lookupMasterItem);
};

export const getMaxOptionOrderById = async ({ queryKey }) => {
  const [, lookupMasterId] = queryKey;
  return await axios.get(
    `${apiRoutes.lookupMasterItem}/getMaxOptionOrder/${lookupMasterId}`
  );
};
