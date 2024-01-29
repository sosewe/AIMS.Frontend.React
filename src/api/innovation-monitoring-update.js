import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newInnovationMonitoringUpdate = async (values) => {
  return await axios.post(apiRoutes.innovationMonitoringUpdate, values);
};

export const getInnovationMonitoringUpdateByInnovationId = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.innovationMonitoringUpdate}/${id}`);
};

export const deleteInnovationMonitoringUpdate = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.innovationMonitoringUpdate}/${id}`);
};
