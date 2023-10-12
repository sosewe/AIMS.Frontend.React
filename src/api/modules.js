import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getModules = async () => {
  return await axios.get(`${apiRoutes.modules}`);
};

export const newModule = async (values) => {
  return await axios.post(apiRoutes.modules, values);
};
