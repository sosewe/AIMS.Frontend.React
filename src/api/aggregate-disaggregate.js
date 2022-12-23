import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getAggregateDisaggregates = async ({ queryKey }) => {
  const [, aggregateId] = queryKey;
  return await axios.get(
    `${apiRoutes.aggregateDisaggregate}/GetAggregateDisAggregateByAggregateId/${aggregateId}`
  );
};
