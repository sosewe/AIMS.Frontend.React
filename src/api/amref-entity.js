import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getAmrefEntities = async () => {
  return await axios.get(apiRoutes.amrefEntity);
};
