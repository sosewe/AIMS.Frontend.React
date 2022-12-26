import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const saveIndicatorAttributeTypes = async (values) => {
  return await axios.post(
    `${apiRoutes.indicatorAttributeType}/AddRange`,
    values
  );
};
