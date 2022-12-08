import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getProgrammes = async () => {
  return await axios.get(apiRoutes.programme);
};
