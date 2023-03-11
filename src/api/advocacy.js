import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newAdvocacy = async (values) => {
  return await axios.post(apiRoutes.advocacy, values);
};

export const getAdvocates = async () => {
  return await axios.get(apiRoutes.advocacy);
};
