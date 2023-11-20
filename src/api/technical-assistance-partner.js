import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newTechnicalAssistancePartner = async (values) => {
  return await axios.post(apiRoutes.technicalAssistancePartner, values);
};

export const getTechnicalAssistancePartnerByTechnicalAssistanceId = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.technicalAssistancePartner}/${id}`);
};

export const deleteTechnicalAssistancePartnerById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.technicalAssistancePartner}/${id}`);
};
