import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getProgrammeThematicAreaSubThemes = async ({ queryKey }) => {
  const [, programmeId] = queryKey;
  return await axios.get(
    `${apiRoutes.programmeThematicAreaSubTheme}/GetAllByProgrammeId/${programmeId}`
  );
};

export const GetUniqueThematicAreasByProgrammeId = async ({ queryKey }) => {
  const [, programmeId] = queryKey;
  return await axios.get(
    `${apiRoutes.programmeThematicAreaSubTheme}/GetUniqueThematicAreasByProgrammeId/${programmeId}`
  );
};

export const GetUniqueSubThemesByThematicAreaId = async ({ queryKey }) => {
  const [, programmeId, thematicAreaId] = queryKey;
  return await axios.get(
    `${apiRoutes.programmeThematicAreaSubTheme}/GetUniqueSubThemesByThematicAreaId/${programmeId}/${thematicAreaId}`
  );
};
