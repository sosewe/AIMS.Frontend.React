import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getAttributeDataTypes = async () => {
  return await axios.get(`${apiRoutes.attributeDataType}`);
};
