import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const saveIndicatorSubThemes = async (values) => {
  return await axios.post(`${apiRoutes.indicatorSubTheme}/AddRange`, values);
};

export const getIndicatorSubThemesByIndicatorId = async ({ queryKey }) => {
  const [_, indicatorId] = queryKey;
  return await axios.get(
    `${apiRoutes.indicatorSubTheme}/GetIndicatorSubThemesByIndicatorId/${indicatorId}`
  );
};

export const deleteIndicatorSubThemesById = async ({ queryKey }) => {
  const [_, id] = queryKey;
  return await axios.delete(`${apiRoutes.indicatorSubTheme}/${id}`);
};
