import React from "react";
import { Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { lookupItem } from "../../../api/lookup";
import ResultChainAggregateField from "./ResultChainAggregateField";
import ResultChainIndicatorField from "./ResultChainIndicatorField";

const EnterQuantitativeResultField = ({ resultChainIndicator, formik }) => {
  let measureType;
  const {
    data: measureTypeData,
    isLoading: isLoadingMeasureType,
    isError: isErrorMeasureType,
  } = useQuery(
    ["lookupItem", resultChainIndicator.indicatorMeasureId],
    lookupItem,
    { enabled: !!resultChainIndicator.indicatorMeasureId }
  );
  if (!isLoadingMeasureType && !isErrorMeasureType) {
    if (measureTypeData.data.name === "Number(#)") {
      measureType = "#";
    } else if (measureTypeData.data.name === "Percentage(%)") {
      measureType = "%";
    }
  }
  return (
    <Grid
      container
      direction="row"
      justifyContent="left"
      alignItems="left"
      spacing={6}
    >
      <Grid item md={2}>
        {measureType}&nbsp;{resultChainIndicator.indicator.name}
      </Grid>
      <Grid item md={4}>
        <Grid container spacing={2}>
          {resultChainIndicator["resultChainAggregates"].length > 0 ? (
            resultChainIndicator["resultChainAggregates"].map(
              (resultChainAggregate) => {
                return (
                  <React.Fragment key={Math.random().toString(36)}>
                    <ResultChainAggregateField
                      resultChainAggregate={resultChainAggregate}
                      formik={formik}
                    />
                  </React.Fragment>
                );
              }
            )
          ) : (
            <React.Fragment>
              <ResultChainIndicatorField
                resultChainIndicator={resultChainIndicator}
                formik={formik}
              />
            </React.Fragment>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
export default EnterQuantitativeResultField;
