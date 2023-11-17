import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newInnovationMonitoringScaleUp = async (values) => {
  return await axios.post(apiRoutes.innovationScaleUp, values);
};

export const getInnovationMonitoringScaleUpByInnovationId = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.innovationScaleUp}/${id}`);
};

export const deleteInnovationMonitoringScaleUp = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.innovationScaleUp}/${id}`);
};
