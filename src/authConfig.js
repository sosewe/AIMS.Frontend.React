import { LogLevel } from "@azure/msal-browser";

const loggerCallback = (logLevel, message, containsPii) => {
  if (containsPii) {
    return;
  }
  switch (logLevel) {
    case LogLevel.Error:
      console.error(message);
      return;
    case LogLevel.Info:
      console.info(message);
      return;
    case LogLevel.Verbose:
      console.debug(message);
      return;
    case LogLevel.Warning:
      console.warn(message);
      return;
    default:
      return;
  }
};

export const msalConfig = {
  auth: {
    clientId: `${process.env.REACT_APP_CLIENT_ID}`,
    authority: `${process.env.REACT_APP_AUTHORITY}`,
    redirectUri: `${process.env.REACT_APP_RE_DIRECT_URL}`,
    postLogoutRedirectUri: "/",
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback,
      loggerLevel: LogLevel.Verbose,
      piiLoggingEnabled: false,
    },
  },
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
  scopes: ["User.Read"],
};

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};
