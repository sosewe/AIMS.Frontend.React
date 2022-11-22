const protocol = window.location.protocol;
const hostname = window.location.hostname;
const path = protocol + "//" + hostname;
export const apiRoutes = {
  getTokenByPassword: "/api/getTokenByPassword",
  lookupItem: path + process.env.REACT_APP_LOOKUP_PORT + "/api/LookupItem",
  job: "/api/job/:id?",
};
