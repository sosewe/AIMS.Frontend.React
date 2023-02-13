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
