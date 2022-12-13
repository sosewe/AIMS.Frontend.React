import "react-app-polyfill/stable";

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "chart.js/auto";

import App from "./App";
import reportWebVitals from "./utils/reportWebVitals";
import { ThemeProvider } from "./contexts/ThemeContext";
import { msalConfig } from "./authConfig";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Note: Remove the following line if you want to disable the API mocks.
// import "./mocks";

const container = document.getElementById("root");
const root = createRoot(container);
const msalInstance = new PublicClientApplication(msalConfig);
const queryClient = new QueryClient();

root.render(
  <BrowserRouter>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
