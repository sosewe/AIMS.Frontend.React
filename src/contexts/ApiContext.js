// ApiContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { apiRoutes } from "../apiRoutes";
import useKeyCloakAuth from "../hooks/useKeyCloakAuth";
// import { useAccount, useMsal } from "@azure/msal-react";

const ApiContext = createContext();

const initialState = {
  data: null,
  loading: true,
  error: null,
};

function apiReducer(state, action) {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return {
        ...state,
        data: action.payload,
        loading: false,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
}

export function ApiProvider({ children, user }) {
  const [state, dispatch] = useReducer(apiReducer, initialState);
  // const { accounts } = useMsal();
  // const account = useAccount(accounts[0]);
  const roles = user?.roles ?? [];

  useEffect(() => {
    // Make your API request here and dispatch the result
    fetch(`${apiRoutes.permission}`, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json;charset=UTF-8",
      },
      mode: "cors",
      body: JSON.stringify(roles), // body data type must match "Content-Type" header
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      })
      .catch((error) => {
        dispatch({ type: "FETCH_ERROR", payload: error });
      });
  }, [roles]);

  return <ApiContext.Provider value={state}>{children}</ApiContext.Provider>;
}

export function useApi() {
  return useContext(ApiContext);
}
