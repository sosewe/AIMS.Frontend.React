import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const saveProjectThematicFocus = async (values) => {
  return await axios.post(apiRoutes.thematicFocus, values);
};

export const getProjectThematicFocusByProcessLevelItemId = async ({
  queryKey,
}) => {
  const [, processLevelItemId] = queryKey;
  return await axios.get(
    `${apiRoutes.thematicFocus}/GetProjectThematicFocusByProcessLevelItemId/${processLevelItemId}`
  );
};

export const deleteProjectThematicFocus = async ({ queryKey }) => {
  const [, projectThematicFocusId] = queryKey;
  return await axios.delete(
    `${apiRoutes.thematicFocus}/${projectThematicFocusId}`
  );
};
