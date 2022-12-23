import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newProjectAdministrativeProgramme = async (values) => {
  return await axios.post(apiRoutes.projectAdministrativeProgramme, values);
};

export const getProjectAdministrativeProgramme = async ({ queryKey }) => {
  const [, projectId] = queryKey;
  return await axios.get(
    `${apiRoutes.projectAdministrativeProgramme}/GetByProjectId/${projectId}`
  );
};
