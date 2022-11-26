import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getAdministrativeProgrammes = async () => {
  return await axios.get(apiRoutes.administrativeProgramme);
};
