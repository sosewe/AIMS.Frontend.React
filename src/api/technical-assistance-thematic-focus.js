import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const saveTechnicalAssistanceThematicFocus = async (values) => {
  return await axios.post(apiRoutes.technicalAssistanceThematicFocus, values);
};

export const getTechnicalAssistanceThematicFocusByTechnicalAssistanceId =
  async ({ queryKey }) => {
    const [, innovationId] = queryKey;
    return await axios.get(
      `${apiRoutes.technicalAssistanceThematicFocus}/GetByTechnicalAssistanceId/${innovationId}`
    );
  };

export const deleteTechnicalAssistanceThematicFocus = async ({ queryKey }) => {
  console.log("queryKey " + queryKey);
  const [, thematicFocusId] = queryKey;
  return await axios.delete(
    `${apiRoutes.technicalAssistanceThematicFocus}/${thematicFocusId}`
  );
};
