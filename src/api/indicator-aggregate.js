import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const saveIndicatorAggregates = async (values) => {
  return await axios.post(`${apiRoutes.indicatorAggregate}/AddRange`, values);
};

export const getIndicatorAggregatesByIndicatorId = async ({ queryKey }) => {
  const [_, indicatorId] = queryKey;
  return await axios.get(
    `${apiRoutes.indicatorAggregate}/GetIndicatorAggregatesByIndicatorId/${indicatorId}`
  );
};

export const deleteIndicatorAggregatesById = async ({ queryKey }) => {
  const [_, id] = queryKey;
  return await axios.delete(`${apiRoutes.indicatorAggregate}/${id}`);
};
