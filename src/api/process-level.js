import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newProcessLevel = async (values) => {
  return await axios.post(apiRoutes.processLevel, values);
};

export const getAllProcessLevel = async () => {
  return await axios.get(`${apiRoutes.processLevel}`);
};
