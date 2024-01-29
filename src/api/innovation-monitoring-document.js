import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newInnovationMonitoringUpdateDocument = async (values) => {
  return await axios.post(apiRoutes.innovationDocument, values);
};

export const getInnovationMonitoringUpdateDocumentByInnovationId = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.get(
    `${apiRoutes.innovationDocument}/InnovationDocument/${id}`
  );
};

export const deleteInnovationMonitoringUpdateDocument = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.innovationDocument}/${id}`);
};
