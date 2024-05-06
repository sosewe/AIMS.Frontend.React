import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getAllIndicators = async ({ queryKey }) => {
  const [, page, pageSize, filterModel] = queryKey;
  // return await axios.post(`${apiRoutes.indicator}/GetIndicators?PageNumber=${page}&PageSize=${pageSize}`, filterModel.items);
  return await axios.get(`${apiRoutes.indicator}`);
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

export const GetIndicatorsByIndicatorTypeIdAndIndicatorRelationshipTypeId =
  async ({ queryKey }) => {
    const [, indicatorTypeId, indicatorRelationshipTypeId] = queryKey;
    return await axios.get(
      `${apiRoutes.indicator}/GetIndicatorsByIndicatorTypeIdAndIndicatorRelationshipTypeId/${indicatorTypeId}/${indicatorRelationshipTypeId}`
    );
  };
