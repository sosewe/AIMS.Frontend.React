import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newProjectThematicArea = async (values) => {
  return await axios.post(apiRoutes.thematicArea, values);
};

export const getAllThematicAreas = async () => {
  return await axios.get(apiRoutes.thematicArea);
};

export const getThematicArea = async ({ queryKey }) => {
  const [, thematicAreaId] = queryKey;
  return await axios.get(`${apiRoutes.thematicArea}/${thematicAreaId}`);
};
