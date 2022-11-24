import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getProjects = async () => {
  return await axios.get(apiRoutes.project);
};
