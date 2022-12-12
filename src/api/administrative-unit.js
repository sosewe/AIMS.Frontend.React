import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getAdministrativeUnitTopLevel = async () => {
  return await axios.get(
    `${apiRoutes.administrativeUnit}/GetTopLevelAdministrativeUnit`
  );
};

export const getAdministrativeUnitByParentName = async ({ queryKey }) => {
  const [_, parent] = queryKey;
  return await axios.get(
    `${apiRoutes.administrativeUnit}/GetByParentName/${parent}`
  );
};

export const getAdministrativeUnitById = async ({ queryKey }) => {
  const [_, administrativeUnitId] = queryKey;
  return await axios.get(
    `${apiRoutes.administrativeUnit}/${administrativeUnitId}`
  );
};
