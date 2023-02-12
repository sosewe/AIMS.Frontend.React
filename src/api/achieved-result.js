import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getProjectResults = async ({ queryKey }) => {
  const [, projectId, yearId, monthId] = queryKey;
  return await axios.get(
    `${apiRoutes.achievedResult}/GetProcessItemAchievedResults/${projectId}/${yearId}/${monthId}`
  );
};
