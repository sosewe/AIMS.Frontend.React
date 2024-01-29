import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newLearningPartner = async (values) => {
  return await axios.post(apiRoutes.learningPartner, values);
};

export const getLearningPartnerByLearningId = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.learningPartner}/${id}`);
};

export const deleteLearningPartnerById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.learningPartner}/${id}`);
};
