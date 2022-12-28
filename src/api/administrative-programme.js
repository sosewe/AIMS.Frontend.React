import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getAdministrativeProgrammes = async () => {
  return await axios.get(apiRoutes.administrativeProgramme);
};

export const newAdministrativeProgramme = async (values) => {
  return await axios.post(apiRoutes.administrativeProgramme, values);
};

export const getAdministrativeProgrammeById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.administrativeProgramme}/${id}`);
};

export const deleteAdministrativeProgrammeById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.administrativeProgramme}/${id}`);
};
