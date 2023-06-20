const protocol = window.location.protocol;
const hostname = window.location.hostname;
const path = protocol + "//" + hostname;
export const apiRoutes = {
  // Lookup
  lookupItem: `${path}${process.env.REACT_APP_LOOKUP_PORT}/api/LookupItem`,
  lookupMaster: `${path}${process.env.REACT_APP_LOOKUP_PORT}/api/LookupMaster`,
  lookupOption: `${path}${process.env.REACT_APP_LOOKUP_PORT}/api/LookupOption`,
  lookupMasterItem: `${path}${process.env.REACT_APP_LOOKUP_PORT}/api/LookupMasterItem`,
  //Settings
  donor: `${path}${process.env.REACT_APP_SETTINGS_PORT}/api/Donor`,
  amrefEntity: `${path}${process.env.REACT_APP_SETTINGS_PORT}/api/AmrefEntity`,
  organizationUnit: `${path}${process.env.REACT_APP_SETTINGS_PORT}/api/OrganizationUnit`,
  administrativeUnit: `${path}${process.env.REACT_APP_SETTINGS_PORT}/api/AdministrativeUnit`,
  processLevel: `${path}${process.env.REACT_APP_SETTINGS_PORT}/api/ProcessLevel`,
  projectRole: `${path}${process.env.REACT_APP_SETTINGS_PORT}/api/ProjectRole`,
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
  resultChainAggregate: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/ResultChainAggregate`,
  resultChainAttribute: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/ResultChainAttribute`,
  setTarget: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/SetTarget`,
  achievedResult: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/AchievedResult`,
  disaggregate: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/Disaggregate`,
  attributeResponseOption: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/AttributeResponseOption`,
  innovation: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/Innovation`,
  advocacy: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/Advocacy`,
  qualitativeCountry: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/QualitativeCountry`,
  qualitativePeriod: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/QualitativePeriod`,
  qualitativeThematicArea: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/QualitativeThematicArea`,
  advocacyMilestone: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/AdvocacyMilestone`,
  innovationProgress: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/InnovationProgress`,
  innovationChallenge: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/InnovationChallenge`,
  advocacyProgress: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/AdvocacyProgress`,
  advocacyMilestoneProgress: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/AdvocacyMilestoneProgress`,
  primaryResultChainAttribute: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/PrimaryResultChainAttribute`,
  secondaryResultChainAttribute: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/SecondaryResultChainAttribute`,
  // external
  ERPStaffList: `https://stagingapi.amref.org/api/erpStaffList?unit=HQ`,
  administrativeRoles: `https://stagingapi.amref.org/api/workflowStepApproverRoles_View`,
};
