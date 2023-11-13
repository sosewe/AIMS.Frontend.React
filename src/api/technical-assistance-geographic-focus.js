import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const saveTechnicalAssistanceGeographicFocus = async (values) => {
  return await axios.post(
    apiRoutes.technicalAssistanceGeographicalFocus,
    values
  );
};

export const getTechnicalAssistanceGeographicFocusByTechnicalAssistanceId =
  async ({ queryKey }) => {
    const [, innovationId] = queryKey;
    return await axios.get(
      `${apiRoutes.technicalAssistanceGeographicalFocus}/GetByInnovationId/${innovationId}`
    );
  };

export const deleteTechnicalAssistanceGeographicFocus = async ({
  queryKey,
}) => {
  console.log("queryKey " + queryKey);
  const [, geographicFocusId] = queryKey;
  return await axios.delete(
    `${apiRoutes.technicalAssistanceGeographicalFocus}/${geographicFocusId}`
  );
};
