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

export const getLocationBasedDCA = async ({ queryKey }) => {
  const [_, processLevelItemId, implementingYearId] = queryKey;
  return await axios.get(
    `${apiRoutes.doubleCountingAdjustment}/${processLevelItemId}/${implementingYearId}`
  );
};

export const projectLevelDCA = async (values) => {
  return await axios.post(
    `${apiRoutes.doubleCountingAdjustment}/AddProjectLevelDCA`,
    values
  );
};

export const getProjectLevelDCA = async ({ queryKey }) => {
  const [_, processLevelItemId, implementingYearId] = queryKey;
  return await axios.get(
    `${apiRoutes.doubleCountingAdjustment}/GetProjectLevelDCA/${processLevelItemId}/${implementingYearId}`
  );
};

export const getAllProjectsDCA = async ({ queryKey }) => {
  const [_, implementingYearId] = queryKey;
  return await axios.get(
    `${apiRoutes.doubleCountingAdjustment}/GetAllProjectsDCA/${implementingYearId}`
  );
};

export const saveEndOfProjectBrief = async (values) => {
  return await axios.post(`${apiRoutes.endOfProjectBrief}`, values);
};

export const getEndOfProjectBrief = async ({ queryKey }) => {
  const [_, processLevelItemId] = queryKey;
  return await axios.get(
    `${apiRoutes.endOfProjectBrief}/${processLevelItemId}`
  );
};

export const getNarrativeReportsData = async ({ queryKey }) => {
  const [_, processLevelItemId, year, month] = queryKey;
  return await axios.get(
    `${apiRoutes.narrativeReports}/${processLevelItemId}/${year}/${month}`
  );
};

export const saveNarrativeReport = async (values) => {
  return await axios.post(`${apiRoutes.narrativeReports}`, values);
};

export const getSavedNarrativeReports = async ({ queryKey }) => {
  const [_, processLevelItemId, implementationYearId, implementationMonthId] =
    queryKey;
  return await axios.get(
    `${apiRoutes.narrativeReports}/GetNarrativeReports/${processLevelItemId}/${implementationYearId}/${implementationMonthId}`
  );
};
