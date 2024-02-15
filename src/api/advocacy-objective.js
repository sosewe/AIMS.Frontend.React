import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newAdvocacyObjective = async (values) => {
  return await axios.post(apiRoutes.advocacyObjective, values);
};

export const getAdvocacyObjectiveById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.advocacyObjective}/${id}`);
};

export const getAdvocacyObjectiveByAdvocacyId = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(
    `${apiRoutes.advocacyObjective}/GetAdvocacyObjectiveByAdvocacyId/${id}`
  );
};

export const deleteAdvocacyObjectiveById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.advocacyObjective}/${id}`);
};
