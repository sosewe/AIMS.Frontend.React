import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newTechnicalAssistanceStaff = async (values) => {
  return await axios.post(apiRoutes.technicalAssistanceStaff, values);
};

export const getTechnicalAssistanceStaffByTechnicalAssistanceId = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.technicalAssistanceStaff}/${id}`);
};

export const deleteTechnicalAssistanceStaffById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.technicalAssistanceStaff}/${id}`);
};
