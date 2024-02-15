import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const saveAdvocacyThematicFocus = async (values) => {
  return await axios.post(apiRoutes.advocacyThematicFocus, values);
};

export const getAdvocacyThematicFocusByAdvocacyId = async ({ queryKey }) => {
  const [, advocacyId] = queryKey;
  return await axios.get(`${apiRoutes.advocacyThematicFocus}/${advocacyId}`);
};

export const deleteAdvocacyThematicFocus = async ({ queryKey }) => {
  const [, thematicFocusId] = queryKey;
  return await axios.delete(
    `${apiRoutes.advocacyThematicFocus}/${thematicFocusId}`
  );
};
