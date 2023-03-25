import React from "react";
import ProjectIndicatorTargetsDataEntry from "./ProjectIndicatorTargetsDataEntry";

const ProjectIndicatorTargetsDataEntryForm = ({
  isLoadingResultChainIndicators,
  isErrorResultChainIndicators,
  resultChainIndicators,
  processLevelItemId,
  processLevelTypeId,
  projectLocationId,
  year,
}) => {
  return (
    <React.Fragment>
      {!isLoadingResultChainIndicators && !isErrorResultChainIndicators
        ? resultChainIndicators.data.map((resultChainIndicator) => (
            <React.Fragment key={Math.random().toString(36)}>
              <>
                <ProjectIndicatorTargetsDataEntry
                  resultChainIndicator={resultChainIndicator}
                  processLevelItemId={processLevelItemId}
                  processLevelTypeId={processLevelTypeId}
                  projectLocationId={projectLocationId}
                  year={year}
                />
              </>
            </React.Fragment>
          ))
        : ""}
    </React.Fragment>
  );
};
export default ProjectIndicatorTargetsDataEntryForm;
