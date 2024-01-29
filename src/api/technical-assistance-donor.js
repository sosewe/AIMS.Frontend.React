import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newTechnicalAssistanceDonor = async (values) => {
  return await axios.post(apiRoutes.technicalAssistanceDonor, values);
};

export const getTechnicalAssistanceDonorByTechnicalAssistanceId = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.technicalAssistanceDonor}/${id}`);
};

export const deleteTechnicalAssistanceDonorById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.technicalAssistanceDonor}/${id}`);
};
