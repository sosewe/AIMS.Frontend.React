import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newProjectAdministrativeProgramme = async (values) => {
  return await axios.post(apiRoutes.projectAdministrativeProgramme, values);
};
