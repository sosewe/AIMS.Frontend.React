import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newProcessLevelCostCentre = async (values) => {
  return await axios.post(apiRoutes.processLevelCostCentre, values);
};

export const getProcessLevelCostCentreByProcessLevelItemId = async ({
  queryKey,
}) => {
  const [, processLevelItemId] = queryKey;
  return await axios.get(
    `${apiRoutes.processLevelCostCentre}/getProcessLevelCostCentreByProcessLevelItemId/${processLevelItemId}`
  );
};
