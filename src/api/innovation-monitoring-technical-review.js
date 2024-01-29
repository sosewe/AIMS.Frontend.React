import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newInnovationMonitoringTechnicalReview = async (values) => {
  return await axios.post(apiRoutes.innovationTechnicalReview, values);
};

export const getInnovationMonitoringTechnicalReviewByInnovationId = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.get(
    `${apiRoutes.innovationTechnicalReview}/InnovationTechnicalReview/${id}`
  );
};

export const deleteInnovationMonitoringTechnicalReview = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.innovationTechnicalReview}/${id}`);
};
