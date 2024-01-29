import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newLearningStaff = async (values) => {
  return await axios.post(apiRoutes.learningStaff, values);
};

export const getLearningStaffByLearningId = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.learningStaff}/${id}`);
};
