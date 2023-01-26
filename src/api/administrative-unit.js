import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getAdministrativeUnitTopLevel = async () => {
  return await axios.get(
    `${apiRoutes.administrativeUnit}/GetTopLevelAdministrativeUnit`
  );
};

export const getAdministrativeUnitByParentName = async ({ queryKey }) => {
  const [, parent] = queryKey;
  return await axios.get(
    `${apiRoutes.administrativeUnit}/GetByParentName/${parent}`
  );
};

export const getAdministrativeUnitById = async ({ queryKey }) => {
  const [, administrativeUnitId] = queryKey;
  return await axios.get(
    `${apiRoutes.administrativeUnit}/${administrativeUnitId}`
  );
};

export const getAdministrativeUnits = async () => {
  return await axios.get(`${apiRoutes.administrativeUnit}`);
};

export const newAdministrativeUnit = async (values) => {
  return await axios.post(`${apiRoutes.administrativeUnit}`, values);
};

export const deleteAdministrativeUnit = async ({ queryKey }) => {
  const [, administrativeUnitId] = queryKey;
  return await axios.delete(
    `${apiRoutes.administrativeUnit}/${administrativeUnitId}`
  );
};
