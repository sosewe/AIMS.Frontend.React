import { useQuery } from "@tanstack/react-query";
import { getSavedNarrativeReports } from "../../../api/internal-reporting";

const ProjectNarrative = ({
  processLevelItemId,
  implementationYearId,
  implementationMonthId,
}) => {
  const { isLoading, isError, data } = useQuery(
    [
      "getSavedNarrativeReports",
      processLevelItemId,
      implementationYearId,
      implementationMonthId,
    ],
    getSavedNarrativeReports
  );

  if (!isLoading && !isError && data) {
    if (data.data.length > 0) {
      return data.data[0].overallProjectComments;
    }
  }
};
export default ProjectNarrative;
