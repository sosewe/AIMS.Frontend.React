import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getIndicatorRawDatasetTable = async ({ queryKey }) => {
  const [_, implementingYearId, processLevelItemId] = queryKey;
  return await axios.get(
    `${apiRoutes.projectAchievedResult}/ResultsTable/${implementingYearId}/${processLevelItemId}`
  );
};

export const getYTDRawSummaryDetails = async (year, processLevelItemId) => {
  return await axios.get(
    `${apiRoutes.projectAchievedResult}/YTD/${year}/${processLevelItemId}`
  );
};

export const getDCAResults = async ({ queryKey }) => {
  const [_, implementingYearId, year] = queryKey;
  return await axios.get(
    `${apiRoutes.projectAchievedResult}/GetDCAResults/${implementingYearId}/${year}`
  );
};

export const uploadDCAReportingFile = async (values) => {
  const formData = new FormData();
  formData.append("file", values);
  return await axios.post(`${apiRoutes.projectAchievedResult}/file`, formData);
};

export const locationBasedDCA = async (values) => {
  return await axios.post(`${apiRoutes.doubleCountingAdjustment}`, values);
};
