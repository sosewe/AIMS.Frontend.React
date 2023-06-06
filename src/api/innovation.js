import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newInnovation = async (values) => {
  return await axios.post(apiRoutes.innovation, values);
};

export const getInnovations = async () => {
  return await axios.get(apiRoutes.innovation);
};

export const getInnovationById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.innovation}/${id}`);
};

export const getInnovationByProcessLevelItemId = async ({ queryKey }) => {
  const [, processLevelItemId] = queryKey;
  return await axios.get(
    `${apiRoutes.innovation}/ProcessLevelItem/${processLevelItemId}`
  );
};

export const deleteInnovationById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.innovation}/${id}`);
};
