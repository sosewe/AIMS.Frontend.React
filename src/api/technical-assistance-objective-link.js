import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newTechnicalAssistanceObjectiveLink = async (values) => {
  return await axios.post(apiRoutes.technicalAssistanceObjectiveLink, values);
};

export const getTechnicalAssistanceObjectiveLinkByTechnicalAssistanceId =
  async ({ queryKey }) => {
    const [, editId] = queryKey;
    return await axios.get(
      `${apiRoutes.technicalAssistanceObjectiveLink}/TechnicalAssistanceUpdateObjective/${editId}`
    );
  };

export const deleteTechnicalAssistanceObjectiveLinkById = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.delete(
    `${apiRoutes.technicalAssistanceObjectiveLink}/${id}`
  );
};
