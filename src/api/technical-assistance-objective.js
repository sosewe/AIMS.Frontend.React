import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newTechnicalAssistanceObjective = async (values) => {
  return await axios.post(apiRoutes.technicalAssistanceObjective, values);
};

export const getTechnicalAssistanceObjectiveByTechnicalAssistanceId = async ({
  queryKey,
}) => {
  const [, editId] = queryKey;
  return await axios.get(`${apiRoutes.technicalAssistanceObjective}/${editId}`);
};

export const deleteTechnicalAssistanceObjectiveById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.technicalAssistanceObjective}/${id}`);
};
