import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newAdvocacy = async (values) => {
  return await axios.post(apiRoutes.advocacy, values);
};

export const getAdvocates = async () => {
  return await axios.get(apiRoutes.advocacy);
};

export const getAdvocacyById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.advocacy}/${id}`);
};

export const getAdvocacyByProcessLevelItemId = async ({ queryKey }) => {
  const [, processLevelItemId] = queryKey;

  console.log("processLevelItemId " + processLevelItemId);
  return await axios.get(
    `${apiRoutes.advocacy}/GetAdvocacyByProcessLevel/${processLevelItemId}`
  );
};

export const deleteAdvocacyById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.advocacy}/${id}`);
};
