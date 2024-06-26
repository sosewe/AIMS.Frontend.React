import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getAttributeResponseOptions = async ({ queryKey }) => {
  const [, attributeTypeId] = queryKey;
  return await axios.get(
    `${apiRoutes.attributeResponseOption}/GetAllByAttributeTypeId/${attributeTypeId}`
  );
};

export const getAllAttributeResponseOptions = async () => {
  return await axios.get(`${apiRoutes.attributeResponseOption}`);
};

export const getAttributeResponseOptionById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.attributeResponseOption}/${id}`);
};

export const deleteAttributeResponseOptionById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.attributeResponseOption}/${id}`);
};

export const createAttributeResponseOption = async (values) => {
  return await axios.post(`${apiRoutes.attributeResponseOption}`, values);
};
