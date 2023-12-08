import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newAdvocacyGeographicalFocus = async (values) => {
  return await axios.post(apiRoutes.advocacyGeographicalFocus, values);
};

export const getAdvocacyGeographicalFocus = async ({ queryKey }) => {
  const [, advocacyId] = queryKey;
  return await axios.get(
    `${apiRoutes.advocacyGeographicalFocus}/${advocacyId}`
  );
};

export const deleteAdvocacyGeographicalFocus = async ({ queryKey }) => {
  const [, advocacyGeographicalFocusId] = queryKey;
  return await axios.delete(
    `${apiRoutes.advocacyGeographicalFocus}/${advocacyGeographicalFocusId}`
  );
};

export const getProjectLocation = async ({ queryKey }) => {
  const [, advocacyGeographicalFocusId] = queryKey;
  return await axios.get(
    `${apiRoutes.advocacyGeographicalFocus}/${advocacyGeographicalFocusId}`
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
