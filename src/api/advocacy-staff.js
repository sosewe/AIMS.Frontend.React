import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newAdvocacyStaff = async (values) => {
  return await axios.post(apiRoutes.advocacyStaff, values);
};

export const getAdvocacyStaff = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.advocacyStaff}/${id}`);
};
