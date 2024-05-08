import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const saveIndicatorAttributeTypes = async (values) => {
  return await axios.post(
    `${apiRoutes.indicatorAttributeType}/AddRange`,
    values
  );
};

export const getIndicatorAttributeType = async ({ queryKey }) => {
  const [, indicatorAttributeTypeId] = queryKey;
  return await axios.get(
    `${apiRoutes.indicatorAttributeType}/${indicatorAttributeTypeId}`
  );
};

export const getIndicatorAttributeTypes = async () => {
  return await axios.get(`${apiRoutes.indicatorAttributeType}`);
};

export const getIndicatorAttributeTypesByIndicatorId = async ({ queryKey }) => {
  const [, indicatorId] = queryKey;
  return await axios.get(
    `${apiRoutes.indicatorAttributeType}/GetIndicatorAttributeTypesByIndicatorId/${indicatorId}`
  );
};

export const deleteIndicatorAttributeById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.indicatorAttributeType}/${id}`);
};
