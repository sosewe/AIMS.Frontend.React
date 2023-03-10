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

export const deleteLookupItem = async ({ queryKey }) => {
  const [_, id] = queryKey;
  return await axios.delete(apiRoutes.lookupItem + "/Delete/" + id);
};

export const getLookupMasterItemsByName = async ({ queryKey }) => {
  const [_, masterName] = queryKey;
  return await axios.get(
    apiRoutes.lookupOption + "/optionsByName/" + masterName
  );
};

export const getAMREFStaffList = async () => {
  return await axios.get(apiRoutes.ERPStaffList);
};

export const getAdministrativeRoles = async () => {
  return await axios.get(apiRoutes.administrativeRoles);
};
