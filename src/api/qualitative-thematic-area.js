import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newQualitativeThematicArea = async (values) => {
  return await axios.post(apiRoutes.qualitativeThematicArea, values);
};

export const getQualitativeThematicAreaByTypeItemId = async ({ queryKey }) => {
  const [, qualitativeTypeItemId] = queryKey;
  return await axios.get(
    `${apiRoutes.qualitativeThematicArea}/${qualitativeTypeItemId}`
  );
};
