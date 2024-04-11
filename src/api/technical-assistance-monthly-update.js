import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newTechnicalAssistanceMonthlyUpdate = async (values) => {
  return await axios.post(apiRoutes.technicalAssistanceMonthlyUpdate, values);
};

export const getTechnicalAssistanceMonthlyUpdateById = async ({ queryKey }) => {
  const [, editId] = queryKey;
  return await axios.get(
    `${apiRoutes.technicalAssistanceMonthlyUpdate}/GetTechnicalAssistanceByUpdateId/${editId}`
  );
};

export const getTechnicalAssistanceMonthlyUpdateByMonitoringPeriod = async ({
  queryKey,
}) => {
  const [, id, locationId, reportingPeriod, implementationYear] = queryKey;
  return await axios.get(
    `${apiRoutes.technicalAssistanceMonthlyUpdate}/GetTechnicalAssistanceMonthlyUpdateByMonitoringPeriod/${id}/${locationId}/${reportingPeriod}/${implementationYear}`
  );
};

export const getTechnicalAssistanceMonthlyUpdateByTechnicalAssistanceId =
  async ({ queryKey }) => {
    const [, id] = queryKey;
    return await axios.get(
      `${apiRoutes.technicalAssistanceMonthlyUpdate}/${id}`
    );
  };

export const deleteTechnicalAssistanceMonthlyUpdateById = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.delete(
    `${apiRoutes.technicalAssistanceMonthlyUpdate}/${id}`
  );
};
