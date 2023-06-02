import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getLookupMasters = async () => {
  return await axios.get(`${apiRoutes.lookupMaster}`);
};

export const getLookupMasterById = async ({ queryKey }) => {
  const [, lookupMasterId] = queryKey;
  return await axios.get(
    `${apiRoutes.lookupMaster}/masterById/${lookupMasterId}`
  );
};

export const saveLookupMaster = async (values) => {
  return await axios.post(`${apiRoutes.lookupMaster}`, values);
};

export const getMaxOptionOrderById = async ({ queryKey }) => {
  const [, lookupMasterId] = queryKey;
  return await axios.get(
    `${apiRoutes.lookupMaster}/masterById/${lookupMasterId}`
  );
};
