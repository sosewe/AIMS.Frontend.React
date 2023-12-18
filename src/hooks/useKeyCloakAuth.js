import { useContext } from "react";
import { AuthProvider } from "../App";

const useKeyCloakAuth = () => {
  const context = useContext(AuthProvider);

  if (!context)
    throw new Error("AuthContext must be placed within AuthProvider");

  return context;
};
export default useKeyCloakAuth;
