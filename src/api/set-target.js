import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const saveProjectTargets = async (inData) => {
  return await axios.post(`${apiRoutes.setTarget}`, inData);
};

export const getSetTarget = async ({ queryKey }) => {
  const [
    ,
    processLevelItemId,
    processLevelTypeId,
    projectLocationId,
    resultChainIndicatorId,
    implementationYearId,
    monthId,
  ] = queryKey;
  return await axios.get(
    `${apiRoutes.setTarget}/GetSetTarget/${processLevelItemId}/${processLevelTypeId}/${projectLocationId}/${resultChainIndicatorId}/${implementationYearId}/${monthId}`
  );
};

export const getProjectTargets = async ({ queryKey }) => {
  const [, implementationYearId, locationId] = queryKey;
  return await axios.get(
    `${apiRoutes.setTarget}/GetProjectTargets/${implementationYearId}/${locationId}`
  );
};
