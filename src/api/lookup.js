import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const useLookupItems = async () => {
  return await axios.get(apiRoutes.lookupItem);
};

export const newLookupItem = async (values) => {
  return await axios.post(apiRoutes.lookupItem, values);
};

export const lookupItem = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(apiRoutes.lookupItem + "/item/" + id);
};

export const deleteLookupItem = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(apiRoutes.lookupItem + "/Delete/" + id);
};

export const getLookupMasterItemsByName = async ({ queryKey }) => {
  const [, masterName] = queryKey;
  return await axios.get(
    apiRoutes.lookupOption + "/optionsByName/" + masterName
  );
};

export const getLookupItemByName = async ({ queryKey }) => {
  const [, name] = queryKey;
  return await axios.get(`${apiRoutes.lookupItem}/getLookupItemByName/${name}`);
};

export const getLookupItemByAlias = async ({ queryKey }) => {
  const [, alias] = queryKey;
  return await axios.get(
    `${apiRoutes.lookupItem}/getLookupItemByAlias/${alias}`
  );
};

export const getAMREFStaffList = async () => {
  return await axios.get(apiRoutes.personnel);
};

export const getAMREFPersonnelById = async ({ queryKey }) => {
  const [, personnelId] = queryKey;
  return await axios.get(
    `${apiRoutes.personnel}/GetPersonnelById/${personnelId}`
  );
};

export const getAdministrativeRoles = async () => {
  const tok = await getDQABearerToken();

  return await axios.get(apiRoutes.administrativeRoles, {
    headers: { Authorization: `Bearer ${tok}` },
  });
};
export const getDQABearerToken = async () => {
  const credential = {
    UserName: "aims@amref.org",

    password: "@1M5@2021", //DqaUserConfig.UserName ,

    //UserName: DqaUserConfig.UserName.values,

    //password: DqaUserConfig.password.values,
  };

  const response = await axios.post(apiRoutes.GenerateBearerToken, credential);

  const { Token } = response.data; // Replace 'specificKey' with the desired key from the JSON response

  return Token;
};
