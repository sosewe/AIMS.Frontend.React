import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getSubThemesByThematicAreaId = async ({ queryKey }) => {
  const [, thematicAreaId] = queryKey;
  return await axios.get(
    `${apiRoutes.thematicAreaSubTheme}/ThematicAreaSubThemeByThematicAreaId/${thematicAreaId}`
  );
};
