import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getSubThemesByThematicAreaId = async ({ queryKey }) => {
  const [, thematicAreaId] = queryKey;
  return await axios.get(
    `${apiRoutes.thematicAreaSubTheme}/ThematicAreaSubThemeByThematicAreaId/${thematicAreaId}`
  );
};

export const getAllSubThemesByThematicAreaId = async ({ queryKey }) => {
  const [, thematicAreaId] = queryKey;
  return await axios.get(
    `${apiRoutes.thematicAreaSubTheme}/GetSubThemesByThematicAreaId/${thematicAreaId}`
  );
};

export const saveThematicAreaSubTheme = async (values) => {
  return await axios.post(`${apiRoutes.thematicAreaSubTheme}`, values);
};
