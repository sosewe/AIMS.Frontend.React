import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newInnovationMonitoringUpdateRisk = async (values) => {
  return await axios.post(apiRoutes.innovationMonitoringUpdate, values);
};

export const getInnovationMonitoringUpdateRiskByInnovationId = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.innovationMonitoringUpdateRisk}/${id}`);
};

export const deleteInnovationMonitoringUpdateRisk = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.innovationMonitoringUpdate}/${id}`);
};
