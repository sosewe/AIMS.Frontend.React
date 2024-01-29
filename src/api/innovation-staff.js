import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newInnovationStaff = async (values) => {
  return await axios.post(apiRoutes.innovationStaff, values);
};

export const getInnovationStaff = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.innovationStaff}/${id}`);
};
