import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getIndicatorRawDataset = async (
  implementingYearId,
  processLevelItemId
) => {
  return await axios.get(
    `${apiRoutes.projectAchievedResult}/Results/${implementingYearId}/${processLevelItemId}`
  );
};

export const getYTDRawSummaryDetails = async (year, processLevelItemId) => {
  return await axios.get(
    `${apiRoutes.projectAchievedResult}/YTD/${year}/${processLevelItemId}`
  );
};
