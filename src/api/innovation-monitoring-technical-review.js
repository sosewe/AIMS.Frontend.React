import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newInnovationMonitoringTechnicalReview = async (values) => {
  return await axios.post(
    apiRoutes.innovationMonitoringTechnicalReview,
    values
  );
};

export const getInnovationMonitoringTechnicalReviewByInnovationId = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.get(
    `${apiRoutes.innovationMonitoringTechnicalReview}/${id}`
  );
};

export const deleteInnovationMonitoringTechnicalReview = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.delete(
    `${apiRoutes.innovationMonitoringTechnicalReview}/${id}`
  );
};
