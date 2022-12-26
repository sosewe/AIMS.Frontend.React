import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const saveIndicatorThematicArea = async (values) => {
  return await axios.post(`${apiRoutes.indicatorThematicArea}`, values);
};
