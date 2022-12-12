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
  // external
  ERPStaffList: `https://stagingapi.amref.org/api/erpStaffList?unit=HQ`,
  administrativeRoles: `https://stagingapi.amref.org/api/workflowStepApproverRoles_View`,
};
