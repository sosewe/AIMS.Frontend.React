import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newInnovationMetric = async (values) => {
  return await axios.post(apiRoutes.innovationMetric, values);
};

export const getInnovationMetricByInnovationId = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.innovationMetric}/${id}`);
};

export const deleteInnovationMetric = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.innovationMetric}/${id}`);
};
