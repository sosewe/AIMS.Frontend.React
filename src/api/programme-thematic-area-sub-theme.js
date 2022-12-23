import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getProgrammeThematicAreaSubThemes = async ({ queryKey }) => {
  const [_, programmeId] = queryKey;
  return await axios.get(
    `${apiRoutes.programmeThematicAreaSubTheme}/GetAllByProgrammeId/${programmeId}`
  );
};

export const GetUniqueThematicAreasByProgrammeId = async ({ queryKey }) => {
  const [_, programmeId] = queryKey;
  return await axios.get(
    `${apiRoutes.programmeThematicAreaSubTheme}/GetUniqueThematicAreasByProgrammeId/${programmeId}`
  );
};

export const GetUniqueSubThemesByThematicAreaId = async ({ queryKey }) => {
  const [_, programmeId, thematicAreaId] = queryKey;
  return await axios.get(
    `${apiRoutes.programmeThematicAreaSubTheme}/GetUniqueSubThemesByThematicAreaId/${programmeId}/${thematicAreaId}`
  );
};
