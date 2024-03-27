import React from "react";
import { Grid } from "@mui/material";
import QuantitativeResultField from "./QuantitativeResultField";

const QuantitativeResultsView = ({
  resultChainIndicators,
  processLevelItemId,
  processLevelTypeId,
  projectLocationId,
  monthId,
  year,
}) => {
  return (
    <React.Fragment>
      <Grid
        container
        direction="row"
        justifyContent="left"
        alignItems="left"
        spacing={6}
      >
        {resultChainIndicators.map((resultChainIndicator, i) => {
          return (
            <React.Fragment key={Math.random().toString(36)}>
              <Grid item md={1}>
                {i + 1}
              </Grid>
              <Grid item md={11}>
                <QuantitativeResultField
                  resultChainIndicator={resultChainIndicator}
                  year={year}
                  monthId={monthId}
                  processLevelItemId={processLevelItemId}
                  processLevelTypeId={processLevelTypeId}
                  projectLocationId={projectLocationId}
                  resultChainIndicators={resultChainIndicators}
                />
              </Grid>
            </React.Fragment>
          );
        })}
      </Grid>
    </React.Fragment>
  );
};
export default QuantitativeResultsView;
