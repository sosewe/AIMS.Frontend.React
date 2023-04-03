import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getAttributeTypes = async () => {
  return await axios.get(`${apiRoutes.attributeType}`);
};

export const getAttributeTypeById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.attributeType}/${id}`);
};
