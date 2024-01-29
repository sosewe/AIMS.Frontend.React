import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newTechnicalAssistanceQuarterlyUpdate = async (values) => {
  return await axios.post(apiRoutes.technicalAssistanceQuarterlyUpdate, values);
};

export const getTechnicalAssistanceQuarterlyUpdateById = async ({
  queryKey,
}) => {
  const [, editId] = queryKey;

  console.log(
    JSON.stringify(
      await axios.get(
        `${apiRoutes.technicalAssistanceQuarterlyUpdate}/GetTechnicalAssistanceByUpdateId/${editId}`
      )
    )
  );
  return await axios.get(
    `${apiRoutes.technicalAssistanceQuarterlyUpdate}/GetTechnicalAssistanceByUpdateId/${editId}`
  );
};

export const getTechnicalAssistanceQuarterlyUpdateByTechnicalAssistanceId =
  async ({ queryKey }) => {
    const [, id] = queryKey;
    return await axios.get(
      `${apiRoutes.technicalAssistanceQuarterlyUpdate}/${id}`
    );
  };

export const deleteTechnicalAssistanceQuarterlyUpdateById = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  return await axios.delete(
    `${apiRoutes.technicalAssistanceQuarterlyUpdate}/${id}`
  );
};
