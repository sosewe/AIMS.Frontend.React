import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getAttributeTypes = async () => {
  return await axios.get(`${apiRoutes.attributeType}`);
};
