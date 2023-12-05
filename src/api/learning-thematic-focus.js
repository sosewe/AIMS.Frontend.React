import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const saveLearningThematicFocus = async (values) => {
  return await axios.post(apiRoutes.learningThematicFocus, values);
};

export const getLearningThematicFocusBylearningId = async ({ queryKey }) => {
  const [, learningId] = queryKey;
  return await axios.get(
    `${apiRoutes.learningThematicFocus}/GetBylearningId/${learningId}`
  );
};

export const deleteLearningThematicFocus = async ({ queryKey }) => {
  console.log("queryKey " + queryKey);
  const [, thematicFocusId] = queryKey;
  return await axios.delete(
    `${apiRoutes.learningThematicFocus}/${thematicFocusId}`
  );
};
