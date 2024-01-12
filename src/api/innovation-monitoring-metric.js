import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newInnovationMonitoringUpdateMetric = async (values) => {
  return await axios.post(apiRoutes.innovationMetricByReport, values);
};

export const getInnovationMonitoringUpdateMetricByInnovationId = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.innovationMetricByReport}/${id}`);
};

export const getInnovationMonitoringTargetMetricsByMetricId = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.get(
    `${apiRoutes.innovationMetricByReport}/GetByMetricId/${id}`
  );
};

export const deleteInnovationMonitoringUpdateMetric = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.innovationMetricByReport}/${id}`);
};
