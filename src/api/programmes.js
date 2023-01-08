import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getProgrammes = async () => {
  return await axios.get(apiRoutes.programme);
};

export const deleteProgrammeById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.programme}/${id}`);
};

export const getProgramme = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.programme}/${id}`);
};
