import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newInnovationMonitoringUpdateMetric = async (values) => {
  return await axios.post(apiRoutes.innovationMonitoringUpdate, values);
};

export const getInnovationMonitoringUpdateMetricByInnovationId = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.innovationMonitoringUpdate}/${id}`);
};

export const deleteInnovationMonitoringUpdateMetric = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.innovationMonitoringUpdate}/${id}`);
};
