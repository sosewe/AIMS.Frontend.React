import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newinnovationGeographicalFocus = async (values) => {
  return await axios.post(apiRoutes.innovationGeographicalFocus, values);
};

export const getinnovationGeographicalFocus = async ({ queryKey }) => {
  const [, processLevelItemId] = queryKey;
  return await axios.get(
    `${apiRoutes.innovationGeographicalFocus}/GetGeographicalFocusByProcessLevelItemId/${processLevelItemId}`
  );
};

export const deleteinnovationGeographicalFocus = async ({ queryKey }) => {
  const [, innovationGeographicalFocusId] = queryKey;
  return await axios.delete(
    `${apiRoutes.innovationGeographicalFocus}/${innovationGeographicalFocusId}`
  );
};

export const getProjectLocation = async ({ queryKey }) => {
  const [, innovationGeographicalFocusId] = queryKey;
  return await axios.get(
    `${apiRoutes.innovationGeographicalFocus}/${innovationGeographicalFocusId}`
  );
};

export const getGeographicalFocusByAdminUnitIdAndProcessLevelItemId = async ({
  queryKey,
}) => {
  const [, administrativeUnitId, processLevelItemId] = queryKey;
  return await axios.get(
    `${apiRoutes.location}/GetGeographicalFocusByAdminUnitIdAndProcessLevelItemId/${administrativeUnitId}/${processLevelItemId}`
  );
};
