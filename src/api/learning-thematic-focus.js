import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newLearningThematicFocus = async (values) => {
  return await axios.post(apiRoutes.learningThematicFocus, values);
};

export const getLearningThematicFocusByLearningId = async ({ queryKey }) => {
  const [, learningId] = queryKey;
  return await axios.get(`${apiRoutes.learningThematicFocus}/${learningId}`);
};

export const deleteLearningThematicFocusById = async ({ queryKey }) => {
  const [, thematicFocusId] = queryKey;
  return await axios.delete(
    `${apiRoutes.learningThematicFocus}/${thematicFocusId}`
  );
};
