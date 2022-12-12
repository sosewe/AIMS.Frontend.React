import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newProcessLevelContact = async (values) => {
  return await axios.post(apiRoutes.processLevelContact, values);
};

export const getProcessLevelContactByProcessLevelItemId = async ({
  queryKey,
}) => {
  const [_, processLevelItemId] = queryKey;
  return await axios.get(
    `${apiRoutes.processLevelContact}/GetByProcessLevelItemId/${processLevelItemId}`
  );
};
