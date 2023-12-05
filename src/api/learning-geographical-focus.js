import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newLearningGeographicalFocus = async (values) => {
  return await axios.post(apiRoutes.learningGeographicalFocus, values);
};

export const getLearningGeographicalFocusByLearningId = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.learningGeographicalFocus}/${id}`);
};

export const deleteLearningGeographicalFocus = async ({ queryKey }) => {
  const [, locationId] = queryKey;
  return await axios.delete(
    `${apiRoutes.learningGeographicalFocus}/${locationId}`
  );
};

export const getProjectLocation = async ({ queryKey }) => {
  const [, learningGeographicalFocusId] = queryKey;
  return await axios.get(
    `${apiRoutes.learningGeographicalFocus}/${learningGeographicalFocusId}`
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
