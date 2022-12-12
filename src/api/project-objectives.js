import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newProjectObjectives = async (values) => {
  return await axios.post(apiRoutes.projectObjectives, values);
};

export const getObjectiveByProcessLevelItemId = async ({ queryKey }) => {
  const [_, processLevelItemId] = queryKey;
  return await axios.get(
    `${apiRoutes.projectObjectives}/GetObjectiveByProcessLevelItemId/${processLevelItemId}`
  );
};

export const deleteProjectObjective = async ({ queryKey }) => {
  const [_, projectObjectiveId] = queryKey;
  return await axios.delete(
    `${apiRoutes.projectObjectives}/${projectObjectiveId}`
  );
};
