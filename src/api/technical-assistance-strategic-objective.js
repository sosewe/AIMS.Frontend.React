import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newTechnicalAssistanceStrategicObjective = async (values) => {
  return await axios.post(
    apiRoutes.technicalAssistanceStrategicObjective,
    values
  );
};

export const getTechnicalAssistanceStrategicObjectiveByTechnicalAssistanceId =
  async ({ queryKey }) => {
    const [, id] = queryKey;
    return await axios.get(
      `${apiRoutes.technicalAssistanceStrategicObjective}/${id}`
    );
  };

export const deleteTechnicalAssistanceStrategicObjectiveById = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.delete(
    `${apiRoutes.technicalAssistanceStrategicObjective}/${id}`
  );
};
