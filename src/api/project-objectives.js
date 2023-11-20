import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newProjectObjectives = async (values) => {
  return await axios.post(apiRoutes.projectObjectives, values);
};

export const getObjectives = async ({ queryKey }) => {
  console.log(
    "amrefObjectivesData .." +
      JSON.stringify(await axios.get(`${apiRoutes.projectObjectives}`))
  );

  return await axios.get(`${apiRoutes.projectObjectives}`);
};

export const getObjectiveByProcessLevelItemId = async ({ queryKey }) => {
  const [, processLevelItemId] = queryKey;
  return await axios.get(
    `${apiRoutes.projectObjectives}/GetObjectiveByProcessLevelItemId/${processLevelItemId}`
  );
};

export const deleteProjectObjective = async ({ queryKey }) => {
  const [, projectObjectiveId] = queryKey;
  return await axios.delete(
    `${apiRoutes.projectObjectives}/${projectObjectiveId}`
  );
};

export const getProjectObjectiveById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.projectObjectives}/${id}`);
};
