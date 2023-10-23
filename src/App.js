import React from "react";
import { useRoutes } from "react-router-dom";
import { Provider } from "react-redux";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { CacheProvider } from "@emotion/react";
import {
  AuthenticatedTemplate,
  useMsalAuthentication,
} from "@azure/msal-react";

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

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InteractionType } from "@azure/msal-browser";

const clientSideEmotionCache = createEmotionCache();

function App({ emotionCache = clientSideEmotionCache }) {
  useMsalAuthentication(InteractionType.Redirect);
  const content = useRoutes(routes);

  const { theme } = useTheme();

  return (
    <ApiProvider>
      <CacheProvider value={emotionCache}>
        <HelmetProvider>
          <Helmet
            titleTemplate="%s | AIMS"
            defaultTitle="AIMS - AMREF Information Management System"
          />
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MuiThemeProvider theme={createTheme(theme)}>
                <AuthenticatedTemplate>{content}</AuthenticatedTemplate>
              </MuiThemeProvider>
            </LocalizationProvider>
          </Provider>
          <ToastContainer position="top-right" newestOnTop />
        </HelmetProvider>
      </CacheProvider>
    </ApiProvider>
  );
}

export default App;
