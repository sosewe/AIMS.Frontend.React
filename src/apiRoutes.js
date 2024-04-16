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
  modules: `${path}${process.env.REACT_APP_SETTINGS_PORT}/api/Module`,
  page: `${path}${process.env.REACT_APP_SETTINGS_PORT}/api/Page`,
  action: `${path}${process.env.REACT_APP_SETTINGS_PORT}/api/Action`,
  permission: `${path}${process.env.REACT_APP_SETTINGS_PORT}/api/Permission`,
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
  attributeDataType: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/AttributeDataType`,
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
  innovationDonor: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/InnovationDonor`,
  innovationStaff: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/InnovationStaff`,
  innovationGeographicalFocus: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/InnovationGeographicalFocus`,
  innovationThematicFocus: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/InnovationThematicFocus`,
  innovationObjectiveClassification: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/InnovationObjectiveClassification`,
  innovationObjective: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/InnovationObjective`,
  innovationChallenge: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/InnovationChallenge`,
  innovationProgress: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/InnovationProgress`,
  innovationMetric: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/InnovationMetric`,
  innovationMetricByReport: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/InnovationMetricByReport`,
  innovationRisk: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/InnovationRisk`,
  innovationTechnicalReview: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/InnovationTechnicalReview`,
  innovationScaleUp: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/InnovationScaleUp`,
  innovationDocument: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/InnovationDocument`,
  technicalAssistance: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/TechnicalAssistance`,
  technicalAssistanceDonor: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/TechnicalAssistanceDonor`,
  technicalAssistancePartner: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/TechnicalAssistancePartner`,
  technicalAssistanceStaff: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/TechnicalAssistanceStaff`,
  technicalAssistanceGeographicalFocus: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/TechnicalAssistanceGeographicalFocus`,
  technicalAssistanceThematicFocus: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/TechnicalAssistanceThematicFocus`,
  technicalAssistanceObjective: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/TechnicalAssistanceObjective`,
  technicalAssistanceStrategicObjective: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/TechnicalAssistanceStrategicObjective`,
  technicalAssistanceMonthlyUpdate: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/TechnicalAssistanceMonthlyUpdate`,
  technicalAssistanceObjectiveLink: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/TechnicalAssistanceMonthlyUpdateObjective`,
  technicalAssistanceAgency: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/TechnicalAssistanceMonthlyUpdateAgency`,
  technicalAssistanceModality: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/TechnicalAssistanceMonthlyUpdateModality`,
  technicalAssistanceQuarterlyUpdate: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/TechnicalAssistanceQuarterlyUpdate`,
  technicalAssistanceDocument: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/TechnicalAssistanceDocument`,
  learning: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/Research`,
  learningDonor: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/ResearchDonor`,
  learningPartner: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/ResearchPartner`,
  learningStaff: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/ResearchStaff`,
  learningGeographicalFocus: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/ResearchGeographicalFocus`,
  learningThematicFocus: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/ResearchThematicFocus`,
  learningResearchProgressUpdate: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/ResearchProgressUpdate`,
  learningDocument: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/ResearchDocument`,
  advocacy: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/Advocacy`,
  advocacyDonor: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/AdvocacyDonor`,
  advocacyPartner: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/AdvocacyActor`,
  advocacyStaff: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/AdvocacyStaff`,
  advocacyThematicFocus: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/AdvocacyThematicFocus`,
  advocacyGeographicalFocus: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/AdvocacyGeographicalFocus`,
  advocacyObjective: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/AdvocacyObjective`,
  advocacyContribution: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/AdvocacyContribution`,
  advocacyDocument: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/AdvocacyDocument`,
  qualitativeCountry: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/QualitativeCountry`,
  qualitativePeriod: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/QualitativePeriod`,
  qualitativeThematicArea: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/QualitativeThematicArea`,
  advocacyMilestone: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/AdvocacyMilestone`,
  advocacyProgressUpdate: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/AdvocacyProgressUpdate`,
  advocacyMilestoneProgress: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/AdvocacyMilestoneProgress`,
  primaryResultChainAttribute: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/PrimaryResultChainAttribute`,
  secondaryResultChainAttribute: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/SecondaryResultChainAttribute`,
  programmeThematicArea: `${path}${process.env.REACT_APP_INDICATOR_PORT}/api/ProgrammeThematicArea`,
  // internal reporting
  projectAchievedResult: `${path}${process.env.REACT_APP_INTERNAL_REPORTING}/api/ProjectAchievedResult`,
  doubleCountingAdjustment: `${path}${process.env.REACT_APP_INTERNAL_REPORTING}/api/DoubleCountingAdjustment`,
  endOfProjectBrief: `${path}${process.env.REACT_APP_INTERNAL_REPORTING}/api/EndOfProjectBrief`,
  // external
  ERPStaffList: `https://monitoringapi.amref.org/api/erpStaffList?unit=HQ`,
  administrativeRoles: `https://monitoringapi.amref.org/api/activeRoles`,
  GenerateBearerToken: `https://monitoringapi.amref.org/api/userCheckAccess`,
};
