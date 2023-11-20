import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newTechnicalAssistanceThematicFocus = async (values) => {
  return await axios.post(apiRoutes.technicalAssistanceThematicFocus, values);
};

export const getTechnicalAssistanceThematicFocusByTechnicalAssistanceId =
  async ({ queryKey }) => {
    const [, id] = queryKey;
    return await axios.get(
      `${apiRoutes.technicalAssistanceThematicFocus}/${id}`
    );
  };

export const deleteTechnicalAssistanceThematicFocusById = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.delete(
    `${apiRoutes.technicalAssistanceThematicFocus}/${id}`
  );
};
