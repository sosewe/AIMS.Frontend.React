import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newAdvocacyProgressUpdate = async (values) => {
  return await axios.post(apiRoutes.advocacyProgressUpdate, values);
};

export const getAdvocacyProgressUpdateByAdvocacyId = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.advocacyProgressUpdate}/Advocacy/${id}`);
};

export const getAdvocacyProgressUpdateByProgressId = async ({ queryKey }) => {
  const [, editId] = queryKey;
  return await axios.get(
    `${apiRoutes.advocacyProgressUpdate}/GetUpdateByProgressId/${editId}`
  );
};

export const deleteAdvocacyProgressUpdateUpdate = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.advocacyProgressUpdate}/${id}`);
};
