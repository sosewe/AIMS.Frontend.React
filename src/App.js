import React, { createContext, useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";
import { Provider } from "react-redux";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { CacheProvider } from "@emotion/react";

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import "./i18n";
import createTheme from "./theme";
import routes from "./routes";

import useTheme from "./hooks/useTheme";
import { store } from "./redux/store";
import createEmotionCache from "./utils/createEmotionCache";

// import { AuthProvider } from "./contexts/JWTContext";
// import { AuthProvider } from "./contexts/FirebaseAuthContext";
// import { AuthProvider } from "./contexts/Auth0Context";
// import { AuthProvider } from "./contexts/CognitoContext";
import { ApiProvider } from "./contexts/ApiContext";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { kc } from "./keycloak";

export const AuthProvider = createContext(null);
export const OfficeContext = createContext(null);
export const UserLevelContext = createContext(null);
const clientSideEmotionCache = createEmotionCache();

function App({ emotionCache = clientSideEmotionCache }) {
  const [userInformation, SetUserInformation] = useState(null);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [selectedUserLevel, setSelectedUserLevel] = useState(null);

  const token = localStorage.getItem("kc_token");
  const refreshToken = localStorage.getItem("kc_refreshToken");
  useEffect(() => {
    kc.init({
      /*
      onLoad: "login-required",
      checkLoginIframe: false,
      */
      onLoad: "login-required",
      token,
      refreshToken,
      checkLoginIframe: false,
    }).then((auth) => {
      try {
        if (auth) {
          const user = {
            id: kc.sub,
            name: kc.tokenParsed.name,
            token: kc.token,
            roles: kc.tokenParsed?.resource_access?.["aims_frontend"]?.roles,
            sub: kc.tokenParsed.sub,
            tokenParsed: kc.tokenParsed,
          };
          const office =
            kc.tokenParsed?.Office && kc.tokenParsed?.Office.length > 0
              ? kc.tokenParsed?.Office[0]
              : null;
          SetUserInformation(user);
          setSelectedUserLevel(kc.tokenParsed?.UserLevel);
          setSelectedOffice(office);

          localStorage.setItem("kc_token", kc.token);
          localStorage.setItem("kc_refreshToken", kc.refreshToken);
          console.log(user);
        } else {
          SetUserInformation(null);
          toast("Login failed", {
            type: "error",
          });
        }
      } catch (e) {
        console.log(e);
      }
    });
    kc.onTokenExpired = () => {
      kc.updateToken(30);
    };
  }, []);
  const content = useRoutes(routes);
  const { theme } = useTheme();

  return (
    // <ApiProvider>
    <CacheProvider value={emotionCache}>
      <HelmetProvider>
        <Helmet
          titleTemplate="%s | AIMS"
          defaultTitle="AIMS - AMREF Information Management System"
        />
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MuiThemeProvider theme={createTheme(theme)}>
              <AuthProvider.Provider value={userInformation}>
                <OfficeContext.Provider
                  value={{ selectedOffice, setSelectedOffice }}
                >
                  <UserLevelContext.Provider value={selectedUserLevel}>
                    <ApiProvider user={userInformation}>
                      {userInformation && content}
                    </ApiProvider>
                  </UserLevelContext.Provider>
                </OfficeContext.Provider>
              </AuthProvider.Provider>
            </MuiThemeProvider>
          </LocalizationProvider>
        </Provider>
        <ToastContainer position="top-right" newestOnTop />
      </HelmetProvider>
    </CacheProvider>
    // </ApiProvider>
  );
}

export default App;
