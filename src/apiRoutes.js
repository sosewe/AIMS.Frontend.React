const protocol = window.location.protocol;
const hostname = window.location.hostname;
const path = protocol + "//" + hostname;
export const apiRoutes = {
  lookupItem: path + process.env.REACT_APP_LOOKUP_PORT + "/api/LookupItem",
  lookupOption: path + process.env.REACT_APP_LOOKUP_PORT + "/api/LookupOption",
  project: path + process.env.REACT_APP_INDICATOR_PORT + "/api/Project",
  donor: path + process.env.REACT_APP_SETTINGS_PORT + "/api/Donor",
  ERPStaffList: "https://stagingapi.amref.org/api/erpStaffList?unit=HQ",
};
