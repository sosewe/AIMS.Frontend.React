import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newProjectLocation = async (values) => {
  return await axios.post(apiRoutes.location, values);
};

export const getProjectLocations = async ({ queryKey }) => {
  const [, processLevelItemId] = queryKey;
  return await axios.get(
    `${apiRoutes.location}/GetGeographicalFocusByProcessLevelItemId/${processLevelItemId}`
  );
};

export const deleteProjectLocation = async ({ queryKey }) => {
  const [, projectLocationId] = queryKey;
  return await axios.delete(`${apiRoutes.location}/${projectLocationId}`);
};

export const getProjectLocation = async ({ queryKey }) => {
  const [, projectLocationId] = queryKey;
  return await axios.get(`${apiRoutes.location}/${projectLocationId}`);
};

export const getGeographicalFocusByAdminUnitIdAndProcessLevelItemId = async ({
  queryKey,
}) => {
  const [, administrativeUnitId, processLevelItemId] = queryKey;
  return await axios.get(
    `${apiRoutes.location}/GetGeographicalFocusByAdminUnitIdAndProcessLevelItemId/${administrativeUnitId}/${processLevelItemId}`
  );
};
