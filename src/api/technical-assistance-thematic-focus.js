import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const saveTechnicalAssistanceThematicFocus = async (values) => {
  return await axios.post(apiRoutes.technicalAssistanceThematicFocus, values);
};

export const getTechnicalAssistanceThematicFocusByTechnicalAssistanceId =
  async ({ queryKey }) => {
    const [, id] = queryKey;
    return await axios.get(
      `${apiRoutes.technicalAssistanceThematicFocus}/${id}`
    );
  };

export const deleteTechnicalAssistanceThematicFocus = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(
    `${apiRoutes.technicalAssistanceThematicFocus}/${id}`
  );
};
