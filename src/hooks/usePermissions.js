import { useApi } from "../contexts/ApiContext";
import { useAccount, useMsal } from "@azure/msal-react";

const usePermissions = () => {
  const { data: permissionData } = useApi();
  const { accounts } = useMsal();
  const account = useAccount(accounts[0]);
  const roles = account.idTokenClaims.roles;
  const hasPermission = (permissionName) => {
    if (roles.includes("Super.Admin")) {
      return true;
    }
    const returnVal = permissionData.some(
      (item) => item.name === permissionName
    );
    return returnVal ? true : false;
  };
  return { hasPermission };
};
export default usePermissions;
