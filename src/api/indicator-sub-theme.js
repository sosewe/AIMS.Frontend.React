import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const saveIndicatorSubTheme = async (values) => {
  return await axios.post(`${apiRoutes.indicatorSubTheme}`, values);
};
