import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const saveInnovationThematicFocus = async (values) => {
  return await axios.post(apiRoutes.innovationThematicFocus, values);
};

export const getInnovationThematicFocusByInnovationId = async ({
  queryKey,
}) => {
  const [, innovationId] = queryKey;
  return await axios.get(
    `${apiRoutes.innovationThematicFocus}/GetByInnovationId/${innovationId}`
  );
};

export const deleteInnovationThematicFocus = async ({ queryKey }) => {
  console.log("queryKey " + queryKey);
  const [, thematicFocusId] = queryKey;
  return await axios.delete(
    `${apiRoutes.innovationThematicFocus}/${thematicFocusId}`
  );
};
