import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newTechnicalAssistanceQuarterlyUpdate = async (values) => {
  return await axios.post(apiRoutes.technicalAssistanceQuarterlyUpdate, values);
};

export const getTechnicalAssistanceQuarterlyUpdateByTechnicalAssistanceId =
  async ({ queryKey }) => {
    const [, id] = queryKey;
    return await axios.get(
      `${apiRoutes.technicalAssistanceQuarterlyUpdate}/${id}`
    );
  };

export const deleteTechnicalAssistanceQuarterlyUpdateById = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.delete(
    `${apiRoutes.technicalAssistanceQuarterlyUpdate}/${id}`
  );
};
