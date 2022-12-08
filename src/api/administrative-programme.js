import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getAdministrativeProgrammes = async () => {
  return await axios.get(apiRoutes.administrativeProgramme);
};

export const newAdministrativeProgramme = async (values) => {
  return await axios.post(apiRoutes.administrativeProgramme, values);
};
