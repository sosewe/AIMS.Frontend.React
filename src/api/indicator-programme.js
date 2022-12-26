import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const saveIndicatorProgrammes = async (values) => {
  return await axios.post(`${apiRoutes.indicatorProgramme}/AddRange`, values);
};
