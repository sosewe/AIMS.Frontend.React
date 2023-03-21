import { useQuery } from "@tanstack/react-query";
import { getLookupMasterItemsByName } from "../../../../api/lookup";

const AdvocacyMonitoringMilestoneYear = ({ yearId }) => {
  const {
    isLoading: isLoadingYearsData,
    isError: isErrorYearsData,
    data: yearsData,
  } = useQuery(["years", "Years"], getLookupMasterItemsByName, {
    refetchOnWindowFocus: false,
  });
  if (!isLoadingYearsData && !isErrorYearsData) {
    const year = yearsData.data.find((obj) => obj.lookupItemId === yearId);
    return year ? year.lookupItemName : "";
  }
};
export default AdvocacyMonitoringMilestoneYear;
