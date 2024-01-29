import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newAdvocacyDocument = async (values) => {
  return await axios.post(apiRoutes.advocacyDocument, values);
};

export const getAdvocacyDocumentByAdvocacyId = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(
    `${apiRoutes.advocacyDocument}/AdvocacyDocument/${id}`
  );
};

export const deleteAdvocacyDocument = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.advocacyDocument}/${id}`);
};
