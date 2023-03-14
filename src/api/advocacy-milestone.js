import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newAdvocacyMilestone = async (values) => {
  return await axios.post(apiRoutes.advocacyMilestone, values);
};

export const newAdvocacyMilestoneRange = async (values) => {
  return await axios.post(`${apiRoutes.advocacyMilestone}/AddRange`, values);
};

export const getAdvocacyMilestoneByAdvocacyId = async ({ queryKey }) => {
  const [, advocacyId] = queryKey;
  return await axios.get(`${apiRoutes.advocacyMilestone}/${advocacyId}`);
};
