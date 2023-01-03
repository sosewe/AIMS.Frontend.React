import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getSubTheme = async ({ queryKey }) => {
  const [, subThemeId] = queryKey;
  return await axios.get(`${apiRoutes.subTheme}/item/${subThemeId}`);
};

export const getAllSubThemes = async () => {
  return await axios.get(`${apiRoutes.subTheme}`);
};
