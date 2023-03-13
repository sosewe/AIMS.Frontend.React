import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newQualitativeCountry = async (values) => {
  return await axios.post(apiRoutes.qualitativeCountry, values);
};

export const getQualitativeCountryByTypeItemId = async ({ queryKey }) => {
  const [, qualitativeTypeItemId] = queryKey;
  return await axios.get(
    `${apiRoutes.qualitativeCountry}/${qualitativeTypeItemId}`
  );
};
