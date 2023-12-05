import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newLearning = async (values) => {
  return await axios.post(apiRoutes.learning, values);
};

export const getLearnings = async () => {
  return await axios.get(apiRoutes.learning);
};

export const getLearningByLearningId = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.learning}/${id}`);
};

export const getLearningByProcessLevelItemId = async ({ queryKey }) => {
  const [, processLevelItemId] = queryKey;

  console.log(
    "logging .... " +
      JSON.stringify(
        await axios.get(
          `${apiRoutes.learning}/GetLearningByProcessLevel/${processLevelItemId}`
        )
      )
  );
  return await axios.get(
    `${apiRoutes.learning}/GetLearningByProcessLevel/${processLevelItemId}`
  );
};

export const deleteLearningById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.learning}/${id}`);
};
