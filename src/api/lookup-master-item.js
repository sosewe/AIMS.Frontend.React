import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const saveLookupMasterItem = async (lookupMasterItem) => {
  return await axios.post(`${apiRoutes.lookupMasterItem}`, lookupMasterItem);
};
