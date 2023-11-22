import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newTechnicalAssistanceAgency = async (values) => {
  return await axios.post(apiRoutes.technicalAssistanceAgency, values);
};

export const getTechnicalAssistanceAgencyByTechnicalAssistanceId = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.technicalAssistanceAgency}/${id}`);
};

export const deleteTechnicalAssistanceAgencyById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.technicalAssistanceAgency}/${id}`);
};
