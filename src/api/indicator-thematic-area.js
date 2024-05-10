import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const saveIndicatorThematicAreas = async (values) => {
  return await axios.post(
    `${apiRoutes.indicatorThematicArea}/AddRange`,
    values
  );
};

export const getIndicatorThematicAreas = async ({ queryKey }) => {
  const [_, thematicAreaId] = queryKey;
  return await axios.get(
    `${apiRoutes.indicatorThematicArea}/GetIndicatorThematicAreas/${thematicAreaId}`
  );
};
