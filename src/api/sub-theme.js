import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getSubTheme = async ({ queryKey }) => {
  const [_, subThemeId] = queryKey;
  return await axios.get(`${apiRoutes.subTheme}/item/${subThemeId}`);
};
