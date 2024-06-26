import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newTechnicalAssistanceModality = async (values) => {
  return await axios.post(apiRoutes.technicalAssistanceModality, values);
};

export const getTechnicalAssistanceModalityByTechnicalAssistanceId = async ({
  queryKey,
}) => {
  const [, editId] = queryKey;
  return await axios.get(
    `${apiRoutes.technicalAssistanceModality}/TechnicalAssistanceUpdateModality/${editId}`
  );
};

export const deleteTechnicalAssistanceModalityById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.technicalAssistanceModality}/${id}`);
};
