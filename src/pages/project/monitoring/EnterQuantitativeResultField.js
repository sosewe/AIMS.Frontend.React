import React from "react";
import { Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { lookupItem } from "../../../api/lookup";
import ResultChainAggregateField from "./ResultChainAggregateField";
import ResultChainIndicatorField from "./ResultChainIndicatorField";
import ResultChainAggregateOnlyField from "./ResultChainAggregateOnlyField";
import ResultChainAttributeOnlyField from "./ResultChainAttributeOnlyField";

const EnterQuantitativeResultField = ({
  resultChainIndicator,
  register,
  setValue,
}) => {
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
      <Grid item md={12}>
        {measureType}&nbsp;{resultChainIndicator.indicator.name}
      </Grid>
      <Grid item md={12}>
        <Grid container spacing={6}>
          <Grid item md={12}>
            {resultChainIndicator["resultChainAggregates"].length > 0 &&
            resultChainIndicator["resultChainAttributes"].length > 0 ? (
              <React.Fragment>
                <ResultChainAggregateField
                  resultChainAggregates={
                    resultChainIndicator["resultChainAggregates"]
                  }
                  resultChainAttributes={
                    resultChainIndicator["resultChainAttributes"]
                  }
                  register={register}
                  setValue={setValue}
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                {resultChainIndicator["resultChainAggregates"].length > 0 ? (
                  <React.Fragment>
                    <ResultChainAggregateOnlyField
                      resultChainAggregates={
                        resultChainIndicator["resultChainAggregates"]
                      }
                      register={register}
                    />
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {resultChainIndicator["resultChainAttributes"].length >
                    0 ? (
                      <React.Fragment>
                        <ResultChainAttributeOnlyField
                          resultChainAttributes={
                            resultChainIndicator["resultChainAttributes"]
                          }
                          register={register}
                        />
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <ResultChainIndicatorField
                          resultChainIndicator={resultChainIndicator}
                          register={register}
                        />
                      </React.Fragment>
                    )}
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default EnterQuantitativeResultField;
