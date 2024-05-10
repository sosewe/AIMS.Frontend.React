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
  const [_, implementingYearId, selectedOffice] = queryKey;
  return await axios.get(
    `${apiRoutes.doubleCountingAdjustment}/GetAllProjectsDCA/${implementingYearId}/${selectedOffice}`
  );
};

export const addCountryLevelDCA = async (values) => {
  return await axios.post(
    `${apiRoutes.doubleCountingAdjustment}/AddCountryLevelDCA`,
    values
  );
};

export const addGlobalLevelDCA = async (values) => {
  return await axios.post(
    `${apiRoutes.doubleCountingAdjustment}/AddGlobalLevelDCA`,
    values
  );
};

export const getCountryLevelDCA = async ({ queryKey }) => {
  const [_, implementingYearId, selectedOffice] = queryKey;
  return await axios.get(
    `${apiRoutes.doubleCountingAdjustment}/GetCountryLevelDCA/${implementingYearId}/${selectedOffice}`
  );
};

export const getCountryLevelDCAs = async ({ queryKey }) => {
  const [_, implementingYearId] = queryKey;
  return await axios.get(
    `${apiRoutes.doubleCountingAdjustment}/GetCountryLevelDCAs/${implementingYearId}`
  );
};

export const getGlobalLevelDCA = async ({ queryKey }) => {
  const [_, implementingYearId] = queryKey;
  return await axios.get(
    `${apiRoutes.doubleCountingAdjustment}/GetGlobalLevelDCA/${implementingYearId}`
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

export const getCountryNarrativeReports = async ({ queryKey }) => {
  const [_, countryOffice, implementationYearId, implementationMonthId] =
    queryKey;
  return await axios.get(
    `${apiRoutes.narrativeReports}/GetCountryNarrativeReports/${countryOffice}/${implementationYearId}/${implementationMonthId}`
  );
};

export const saveAddCountryNarrativeReport = async (values) => {
  return await axios.post(
    `${apiRoutes.narrativeReports}/AddCountryNarrativeReport`,
    values
  );
};

export const getAllCountryNarrativeReports = async ({ queryKey }) => {
  const [_, implementationYearId, implementationMonthId, countryOffice] =
    queryKey;
  return await axios.get(
    `${apiRoutes.narrativeReports}/GetAllCountryNarrativeReports/${implementationYearId}/${implementationMonthId}/${countryOffice}`
  );
};

export const getAllNarrativeReports = async ({ queryKey }) => {
  const [_, implementationYearId, implementationMonthId] = queryKey;
  return await axios.get(
    `${apiRoutes.narrativeReports}/GetAllNarrativeReports/${implementationYearId}/${implementationMonthId}`
  );
};

export const getCountryReportData = async ({ queryKey }) => {
  const [_, processLevelItemId] = queryKey;
  return await axios.get(
    `${apiRoutes.narrativeReports}/GetCountryReportData/${processLevelItemId}`
  );
};

export const addCorporateNarrativeReport = async (values) => {
  return await axios.post(
    `${apiRoutes.narrativeReports}/AddCorporateNarrativeReport`,
    values
  );
};

export const getCorporateNarrativeReports = async ({ queryKey }) => {
  const [_, implementingYearId, implementationMonthId] = queryKey;
  return await axios.get(
    `${apiRoutes.narrativeReports}/GetCorporateNarrativeReports/${implementingYearId}/${implementationMonthId}`
  );
};

export const getCountryIndicatorReport = async ({ queryKey }) => {
  const [_, indicatorId, yearId] = queryKey;
  return await axios.get(
    `${apiRoutes.doubleCountingAdjustment}/GetCountryIndicatorReport/${indicatorId}/${yearId}`
  );
};
