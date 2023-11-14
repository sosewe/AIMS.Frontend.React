import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getInnovationMonitoringTargetMetricsByInnovationId = async ({
  queryKey,
}) => {
  const [, id] = queryKey;
  /*return await axios.get(
    `${apiRoutes.innovationMonitoringUpdate}/GetInnovationTargetMetrics/${id}`
  );*/

  return {
    data: [
      {
        id: 1,
        innovationId: "349c07aa-dde5-4103-4bcb-08dbdc4bb36f",
        innovationMetricId: "878c07aa-dde5-4103-4bcb-08dbdc4bb36bf",
        innovationMetricName: "Innovation Metric 1",
        innovationTargetGroupId: "448c07aa-dde5-4103-4bcb-08dbdc4bb36bf",
        innovationTargetGroupName: "Innovation Target Group 1",
        innovationTarget: 2000,
      },
    ],
  };
};
