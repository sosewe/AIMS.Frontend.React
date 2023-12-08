import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newLearningProgressUpdate = async (values) => {
  return await axios.post(apiRoutes.learningResearchProgressUpdate, values);
};

export const getLearningProgressUpdateByLearningId = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(
    `${apiRoutes.learningResearchProgressUpdate}/Research/${id}`
  );
};

export const getLearningProgressUpdateByProgressId = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(
    `${apiRoutes.learningResearchProgressUpdate}/GetUpdateByProgressId/${id}`
  );
};

export const deleteLearningProgressUpdateById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(
    `${apiRoutes.learningResearchProgressUpdate}/${id}`
  );
};
