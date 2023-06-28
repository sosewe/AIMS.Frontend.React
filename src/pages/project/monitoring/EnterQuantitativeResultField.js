import React from "react";
import { Grid } from "@mui/material";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import ResultChainAggregateField from "./ResultChainAggregateField";
import ResultChainIndicatorField from "./ResultChainIndicatorField";
import ResultChainAggregateOnlyField from "./ResultChainAggregateOnlyField";
import ResultChainAttributeOnlyField from "./ResultChainAttributeOnlyField";

const EnterQuantitativeResultField = ({
  resultChainIndicator,
  register,
  setValue,
  year,
  monthId,
}) => {
  return (
    <Grid
      container
      direction="row"
      justifyContent="left"
      alignItems="left"
      spacing={6}
    >
      <Grid item md={12}>
        {resultChainIndicator.indicator.name}
      </Grid>
      <Grid item md={12}>
        <Grid container spacing={6}>
          <Grid item md={12}>
            {resultChainIndicator["resultChainAggregates"].length > 0 &&
            resultChainIndicator["resultChainAttributes"].length > 0 ? (
              <React.Fragment>
                <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <ResultChainAggregateField
                      resultChainAggregates={
                        resultChainIndicator["resultChainAggregates"]
                      }
                      resultChainAttributes={
                        resultChainIndicator["resultChainAttributes"][0]
                      }
                      register={register}
                      setValue={setValue}
                      year={year}
                      monthId={monthId}
                    />
                  </Table>
                </TableContainer>
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
                      setValue={setValue}
                      year={year}
                      monthId={monthId}
                    />
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {resultChainIndicator["resultChainAttributes"].length >
                    0 ? (
                      <React.Fragment>
                        <TableContainer component={Paper}>
                          <Table aria-label="simple table">
                            <ResultChainAttributeOnlyField
                              resultChainAttributes={
                                resultChainIndicator["resultChainAttributes"]
                              }
                              register={register}
                              setValue={setValue}
                              year={year}
                              monthId={monthId}
                            />
                          </Table>
                        </TableContainer>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <ResultChainIndicatorField
                          resultChainIndicator={resultChainIndicator}
                          register={register}
                          setValue={setValue}
                          year={year}
                          monthId={monthId}
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
