import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newInnovationMonitoringUpdateRisk = async (values) => {
  console.log("logging risk .. " + JSON.stringify(values));
  return await axios.post(apiRoutes.innovationRisk, values);
};

export const getInnovationMonitoringUpdateRiskByInnovationId = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.innovationRisk}/InnovationRisk/${id}`);
};

export const deleteInnovationMonitoringUpdateRisk = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.innovationRisk}/${id}`);
};
