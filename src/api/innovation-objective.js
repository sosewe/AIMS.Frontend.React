import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newInnovationObjective = async (values) => {
  return await axios.post(apiRoutes.innovationObjective, values);
};

export const getInnovationObjectiveByInnovationId = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.innovationObjective}/${id}`);
};

export const deleteInnovationObjective = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.innovationObjective}/${id}`);
};
