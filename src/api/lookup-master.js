import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getLookupMasters = async () => {
  return await axios.get(`${apiRoutes.lookupMaster}`);
};
