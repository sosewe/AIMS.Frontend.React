import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getAllIndicators = async ({ queryKey }) => {
  const [, page, pageSize] = queryKey;
  return await axios.get(
    `${apiRoutes.indicator}?PageNumber=${page}&PageSize=${pageSize}`
  );
};

export const newIndicator = async (values) => {
  return await axios.post(apiRoutes.indicator, values);
};

export const deleteIndicatorById = async ({ queryKey }) => {
  const [, indicatorId] = queryKey;
  return await axios.delete(`${apiRoutes.indicator}/${indicatorId}`);
};

export const getIndicator = async ({ queryKey }) => {
  const [, indicatorId] = queryKey;
  return await axios.get(`${apiRoutes.indicator}/${indicatorId}`);
};
