import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newTechnicalAssistanceMonthlyUpdate = async (values) => {
  return await axios.post(apiRoutes.technicalAssistanceMonthlyUpdate, values);
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
