import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newQualitativePeriod = async (values) => {
  return await axios.post(apiRoutes.qualitativePeriod, values);
};

export const getQualitativePeriodByTypeItemId = async ({ queryKey }) => {
  const [, qualitativeTypeItemId] = queryKey;
  return await axios.get(
    `${apiRoutes.qualitativePeriod}/${qualitativeTypeItemId}`
  );
};
