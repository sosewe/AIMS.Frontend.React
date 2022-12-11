import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newImplementingOrganisation = async (values) => {
  return await axios.post(apiRoutes.implementingOrganisation, values);
};

export const getImplementingOrganisationByProcessLevelItemIdAndProcessLevelTypeId =
  async ({ queryKey }) => {
    const [_, processLevelId, processLevelTypeId] = queryKey;
    return await axios.get(
      `${apiRoutes.implementingOrganisation}/GetImplementingOrganisationByProcessLevelItemIdAndProcessLevelTypeId/${processLevelId}/${processLevelTypeId}`
    );
  };
