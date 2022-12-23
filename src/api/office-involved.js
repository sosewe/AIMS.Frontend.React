import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newOfficeInvolvedProcessLevel = async (values) => {
  return await axios.post(apiRoutes.officeInvolved, values);
};

export const getOfficeInvolvedByProcessLevelItemId = async ({ queryKey }) => {
  const [, processLevelItemId] = queryKey;
  return await axios.get(
    `${apiRoutes.officeInvolved}/GetByProcessLevelItemId/${processLevelItemId}`
  );
};
