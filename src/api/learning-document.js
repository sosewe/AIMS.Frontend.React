import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newLearningMonitoringDocument = async (values) => {
  return await axios.post(apiRoutes.learningDocument, values);
};

export const getLearningMonitoringDocumentByResearchId = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.get(
    `${apiRoutes.learningDocument}/ResearchDocument/${id}`
  );
};

export const deleteLearningMonitoringocument = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.learningDocument}/${id}`);
};
