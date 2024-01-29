import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getTechnicalAssistanceByProcessLevelItemId = async ({
  queryKey,
}) => {
  const [, processLevelItemId] = queryKey;
  return await axios.get(
    `${apiRoutes.technicalAssistance}/GetTechnicalAssistanceByProcessLevel/${processLevelItemId}`
  );
};

export const newTechnicalAssistance = async (values) => {
  return await axios.post(apiRoutes.technicalAssistance, values);
};

export const getTechnicalAssistanceByTechnicalAssistanceId = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.get(
    `${apiRoutes.technicalAssistance}/GetByTechnicalAssistanceId/${id}`
  );
};

export const deleteTechnicalAssistanceById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.technicalAssistance}/${id}`);
};
