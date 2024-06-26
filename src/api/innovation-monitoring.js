import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getInnovationMonitoringTargetMetricsByInnovationId = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.innovationMetric}/${id}`);
};

export const getInnovationMonitoringTargetMetricsByMonitoringPeriod = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.innovationMetric}/${id}`);
};

export const getInnovationLocations = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.innovationMetric}/${id}`);
};

// GetInnovationMetricByReportId
