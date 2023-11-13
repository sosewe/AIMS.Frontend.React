import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newTechnicalAssistance = async (values) => {
  return await axios.post(apiRoutes.TechnicalAssistance, values);
};

export const getTechnicalAssistances = async () => {
  return await axios.get(apiRoutes.TechnicalAssistance);
};

export const getTechnicalAssistanceById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.TechnicalAssistance}/${id}`);
};

export const getTechnicalAssistanceByProcessLevelItemId = async ({
  queryKey,
}) => {
  const [, processLevelItemId] = queryKey;

  return await axios.get(apiRoutes.innovation);

  /*
  return await axios.get(
    `${apiRoutes.TechnicalAssistance}/ProcessLevelItem/${processLevelItemId}`
  );*/
};

export const deleteTechnicalAssistanceById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.TechnicalAssistance}/${id}`);
};
