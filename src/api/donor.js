import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newDonor = async (values) => {
  return await axios.post(apiRoutes.donor, values);
};

export const getDonors = async () => {
  return await axios.get(apiRoutes.donor);
};

export const getDonorById = async ({ queryKey }) => {
  const [_, id] = queryKey;
  return await axios.get(`${apiRoutes.donor}/${id}`);
};

export const deleteDonorById = async ({ queryKey }) => {
  const [_, id] = queryKey;
  return await axios.delete(`${apiRoutes.donor}/${id}`);
};
