import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newInnovationObjectiveClassification = async (values) => {
  return await axios.post(apiRoutes.innovationObjectiveClassification, values);
};

export const getInnovationObjectiveClassificationByInnovationId = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.get(
    `${apiRoutes.innovationObjectiveClassification}/${id}`
  );
};

export const deleteInnovationObjectiveClassification = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(
    `${apiRoutes.innovationObjectiveClassification}/${id}`
  );
};
