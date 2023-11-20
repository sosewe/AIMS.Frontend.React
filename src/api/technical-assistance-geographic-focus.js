import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newTechnicalAssistanceGeographicalFocus = async (values) => {
  return await axios.post(
    apiRoutes.technicalAssistanceGeographicalFocus,
    values
  );
};

export const getTechnicalAssistanceGeographicalFocusByTechnicalAssistanceId =
  async ({ queryKey }) => {
    const [, id] = queryKey;
    return await axios.get(
      `${apiRoutes.technicalAssistanceGeographicalFocus}/${id}`
    );
  };

export const deleteTechnicalAssistanceGeographicalFocusById = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.delete(
    `${apiRoutes.technicalAssistanceGeographicalFocus}/${id}`
  );
};
