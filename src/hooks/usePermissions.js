import { useApi } from "../contexts/ApiContext";
import useKeyCloakAuth from "./useKeyCloakAuth";
// import { useAccount, useMsal } from "@azure/msal-react";

const usePermissions = () => {
  const { data: permissionData } = useApi();
  const user = useKeyCloakAuth();
  // const { accounts } = useMsal();
  // const account = useAccount(accounts[0]);
  const roles = user?.roles ?? [];
  const hasPermission = (permissionName) => {
    if (roles.includes("ADMIN")) {
      return true;
    }
    const returnVal =
      permissionData &&
      permissionData.length > 0 &&
      permissionData.some(
        (item) => item.name.toLowerCase() === permissionName.toLowerCase()
      );
    return returnVal ? true : false;
  };
  return { hasPermission };
};
export default usePermissions;
