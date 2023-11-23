import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newTechnicalAssistanceDocument = async (values) => {
  return await axios.post(apiRoutes.technicalAssistanceDocument, values);
};

export const getTechnicalAssistanceDocumentByTechnicalAssistanceId = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.get(
    `${apiRoutes.technicalAssistanceDocument}/TechnicalAssistanceDocument/${id}`
  );
};

export const deleteTechnicalAssistanceDocument = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.technicalAssistanceDocument}/${id}`);
};
