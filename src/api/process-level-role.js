import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newProcessLevelRole = async (values) => {
  return await axios.post(apiRoutes.processLevelRole, values);
};

export const getProcessLevelRoleByProcessLevelItemId = async ({ queryKey }) => {
  const [_, processLevelItemId] = queryKey;
  return await axios.get(
    `${apiRoutes.processLevelRole}/GetByProcessLevelId/${processLevelItemId}`
  );
};
