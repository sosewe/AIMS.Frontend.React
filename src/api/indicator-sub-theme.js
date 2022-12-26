import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const saveIndicatorSubThemes = async (values) => {
  return await axios.post(`${apiRoutes.indicatorSubTheme}/AddRange`, values);
};
