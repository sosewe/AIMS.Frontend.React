import { useQuery } from "@tanstack/react-query";
import { getLookupMasterItemsByName } from "../../../../api/lookup";

const AdvocacyMonitoringMilestoneQuarter = ({ quarterId }) => {
  const {
    isLoading: isLoadingQuartersData,
    isError: isErrorQuartersData,
    data: quartersData,
  } = useQuery(["quarters", "Quarters"], getLookupMasterItemsByName, {
    refetchOnWindowFocus: false,
  });

  if (!isLoadingQuartersData && !isErrorQuartersData) {
    const quarter = quartersData.data.find(
      (obj) => obj.lookupItemId === quarterId
    );
    return quarter ? quarter.lookupItemName : "";
  }
};
export default AdvocacyMonitoringMilestoneQuarter;
