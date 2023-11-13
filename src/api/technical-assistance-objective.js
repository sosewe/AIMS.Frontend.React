import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const saveTechnicalAssistanceObjective = async (values) => {
  return await axios.post(apiRoutes.technicalAssistanceObjective, values);
};

export const getTechnicalAssistanceObjectiveByTechnicalAssistanceId = async ({
  queryKey,
}) => {
  const [, technicalAssistanceId] = queryKey;
  return await axios.get(
    `${apiRoutes.technicalAssistanceObjective}/GetByInnovationId/${technicalAssistanceId}`
  );
};

export const deleteTechnicalAssistanceObjective = async ({ queryKey }) => {
  console.log("queryKey " + queryKey);
  const [, objectiveId] = queryKey;
  return await axios.delete(
    `${apiRoutes.technicalAssistanceObjective}/${objectiveId}`
  );
};
