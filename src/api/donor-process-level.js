import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newDonorProcessLevel = async (values) => {
  return await axios.post(apiRoutes.donorProcessLevel, values);
};

export const GetDonorByProcessLevelIdAndProcessLevelTypeId = async ({
  queryKey,
}) => {
  const [_, processLevelId, processLevelTypeId] = queryKey;
  return await axios.get(
    `${apiRoutes.donorProcessLevel}/GetDonorByProcessLevelIdAndProcessLevelTypeId/${processLevelId}/${processLevelTypeId}`
  );
};
