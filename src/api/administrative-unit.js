import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getAdministrativeUnitTopLevel = async () => {
  return await axios.get(
    `${apiRoutes.administrativeUnit}/GetTopLevelAdministrativeUnit`
  );
};
