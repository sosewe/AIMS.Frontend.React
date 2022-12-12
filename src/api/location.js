import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newProjectLocation = async (values) => {
  return await axios.post(apiRoutes.location, values);
};

export const getProjectLocations = async ({ queryKey }) => {
  const [_, processLevelItemId] = queryKey;
  return await axios.get(
    `${apiRoutes.location}/GetGeographicalFocusByProcessLevelItemId/${processLevelItemId}`
  );
};

export const deleteProjectLocation = async ({ queryKey }) => {
  const [_, projectLocationId] = queryKey;
  return await axios.delete(`${apiRoutes.location}/${projectLocationId}`);
};
