const protocol = window.location.protocol;
const hostname = window.location.hostname;
const path = protocol + "//" + hostname;
export const apiRoutes = {
  // Lookup
  lookupItem: `${path}${process.env.REACT_APP_LOOKUP_PORT}/api/LookupItem`,
  lookupOption: `${path}${process.env.REACT_APP_LOOKUP_PORT}/api/LookupOption`,
  //Settings
  donor: `${path}${process.env.REACT_APP_SETTINGS_PORT}/api/Donor`,
  amrefEntity: `${path}${process.env.REACT_APP_SETTINGS_PORT}/api/AmrefEntity`,
  organizationUnit: `${path}${process.env.REACT_APP_SETTINGS_PORT}/api/OrganizationUnit`,
  administrativeUnit: `${path}${process.env.REACT_APP_SETTINGS_PORT}/api/AdministrativeUnit`,
  processLevel: `${path}${process.env.REACT_APP_SETTINGS_PORT}/api/ProcessLevel`,
  //Indicator
  project: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/Project`,
  donorProcessLevel: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/DonorProcessLevel`,
  processLevelContact: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/ProcessLevelContact`,
  processLevelRole: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/ProcessLevelRole`,
  projectAdministrativeProgramme: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/ProjectAdministrativeProgramme`,
  implementingOrganisation: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/ImplementingOrganisation`,
  administrativeProgramme: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/AdministrativeProgramme`,
  programme: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/Programme`,
  officeInvolved: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/OfficeInvolved`,
  location: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/Location`,
  projectObjectives: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/SetObjective`,
  thematicArea: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/ThematicArea`,
  thematicAreaSubTheme: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/ThematicAreaSubTheme`,
  thematicFocus: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/ThematicFocus`,
  subTheme: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/SubTheme`,
  indicator: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/Indicator`,
  programmeThematicAreaSubTheme: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/ProgrammeThematicAreaSubTheme`,
  aggregate: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/Aggregate`,
  aggregateDisaggregate: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/AggregateDisaggergate`,
  attributeType: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/AttributeType`,
  indicatorProgramme: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/IndicatorProgramme`,
  indicatorThematicArea: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/IndicatorThematicArea`,
  indicatorSubTheme: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/IndicatorSubTheme`,
  indicatorAggregate: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/IndicatorAggregate`,
  indicatorAttributeType: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/IndicatorAttributeType`,
  personnel: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/Personnel`,
  resultChain: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/ResultChain`,
  processLevelCostCentre: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/ProcessLevelCostCentre`,
  resultChainIndicator: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/ResultChainIndicator`,
  // external
  ERPStaffList: `https://stagingapi.amref.org/api/erpStaffList?unit=HQ`,
  administrativeRoles: `https://stagingapi.amref.org/api/workflowStepApproverRoles_View`,
};
