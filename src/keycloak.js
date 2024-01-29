import Keycloak from "keycloak-js";

export const kc = new Keycloak({
  url: `${process.env.REACT_APP_KEY_CLOAK_URL}`,
  realm: `${process.env.REACT_APP_KEY_CLOAK_REALM}`,
  clientId: `${process.env.REACT_APP_KEY_CLOAK_CLIENT}`,
  onLoad: "login-required",
});
