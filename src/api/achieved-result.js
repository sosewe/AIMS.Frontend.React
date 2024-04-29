import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getProjectResults = async ({ queryKey }) => {
  const [, projectId, yearId, monthId, projectGeographicalFocusId] = queryKey;
  return await axios.get(
    `${apiRoutes.achievedResult}/GetProcessItemAchievedResults/${projectId}/${yearId}/${monthId}/${projectGeographicalFocusId}`
  );
};

export const newAchievedResult = async (values) => {
  return await axios.post(apiRoutes.achievedResult, values);
};

export const getProjectResultsByAggregateIdAndAttributeId = async ({
  queryKey,
}) => {
  const [
    ,
    resultChainAggregateId,
    resultChainAttributeId,
    year,
    monthId,
    projectLocationId,
  ] = queryKey;
  return await axios.get(
    `${apiRoutes.achievedResult}/GetProjectResultsByAggregateIdAndAttributeId/${resultChainAggregateId}/${resultChainAttributeId}/${year}/${monthId}/${projectLocationId}`
  );
};

export const getAchievedResultsByResultChainIndicatorIdAndAggregateId = async ({
  queryKey,
}) => {
  const [
    ,
    resultChainIndicatorId,
    resultChainAggregateId,
    year,
    monthId,
    projectLocationId,
  ] = queryKey;
  return await axios.get(
    `${apiRoutes.achievedResult}/GetAchievedResultsByResultChainIndicatorIdAndAggregateId/${resultChainIndicatorId}/${resultChainAggregateId}/${year}/${monthId}/${projectLocationId}`
  );
};

export const getAchievedResultsByResultChainIndicatorIdAndAttributeId = async ({
  queryKey,
}) => {
  const [
    ,
    resultChainIndicatorId,
    resultChainAttributeId,
    year,
    monthId,
    projectLocationId,
  ] = queryKey;
  return await axios.get(
    `${apiRoutes.achievedResult}/GetAchievedResultsByResultChainIndicatorIdAndAttributeId/${resultChainIndicatorId}/${resultChainAttributeId}/${year}/${monthId}/${projectLocationId}`
  );
};

export const getAchievedResultsByResultChainIndicatorId = async ({
  queryKey,
}) => {
  const [, resultChainIndicatorId, year, monthId, projectLocationId] = queryKey;
  return await axios.get(
    `${apiRoutes.achievedResult}/GetAchievedResultsByResultChainIndicatorId/${resultChainIndicatorId}/${year}/${monthId}/${projectLocationId}`
  );
};
