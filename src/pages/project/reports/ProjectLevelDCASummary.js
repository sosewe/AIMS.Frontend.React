import React, { useState } from "react";
import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import { useQuery } from "@tanstack/react-query";
import { getLocationBasedDCA } from "../../../api/internal-reporting";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/Download";

const ProjectLevelDCASummary = ({
  processLevelItemId,
  implementationYearId,
}) => {
  const { isLoading, isError, data } = useQuery(
    ["getLocationBasedDCA", processLevelItemId, implementationYearId],
    getLocationBasedDCA
  );

  const sum = (val, val2) => {
    return Number(val) + Number(val2);
  };

  const difference = (val, val2) => {
    return Number(val) - Number(val2);
  };

  return (
    <React.Fragment>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="grouped table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Location
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Original Child
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Original Youth
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Original Adult
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Original total
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Adjusted Child
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Adjusted Youth
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Adjusted Adult
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Adjusted Total
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Final Child
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Final Youth
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Final Adult
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Final Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading && !isError ? (
              <React.Fragment>
                {data.data.map((locationDCA, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell
                        sx={{ border: "1px solid #000", textAlign: "center" }}
                      >
                        {locationDCA.administrativeUnit}
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid #000", textAlign: "center" }}
                      >
                        {sum(
                          locationDCA.originalChildF,
                          locationDCA.originalChildM
                        )}
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid #000", textAlign: "center" }}
                      >
                        {sum(
                          locationDCA.originalYouthF,
                          locationDCA.originalYouthM
                        )}
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid #000", textAlign: "center" }}
                      >
                        {sum(
                          locationDCA.originalAdultsF,
                          locationDCA.originalAdultsM
                        )}
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid #000", textAlign: "center" }}
                      >
                        {sum(
                          sum(
                            sum(
                              locationDCA.originalChildF,
                              locationDCA.originalChildM
                            ),
                            sum(
                              locationDCA.originalYouthF,
                              locationDCA.originalYouthM
                            )
                          ),
                          sum(
                            locationDCA.originalAdultsF,
                            locationDCA.originalAdultsM
                          )
                        )}
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid #000", textAlign: "center" }}
                      >
                        {sum(locationDCA.childF, locationDCA.childM)}
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid #000", textAlign: "center" }}
                      >
                        {sum(locationDCA.youthF, locationDCA.youthM)}
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid #000", textAlign: "center" }}
                      >
                        {sum(locationDCA.adultsF, locationDCA.adultsM)}
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid #000", textAlign: "center" }}
                      >
                        {sum(
                          sum(
                            sum(locationDCA.adultsF, locationDCA.adultsM),
                            sum(locationDCA.youthF, locationDCA.youthM)
                          ),
                          sum(locationDCA.childF, locationDCA.childM)
                        )}
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid #000", textAlign: "center" }}
                      >
                        {difference(
                          sum(
                            locationDCA.originalChildF,
                            locationDCA.originalChildM
                          ),
                          sum(locationDCA.childF, locationDCA.childM)
                        )}
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid #000", textAlign: "center" }}
                      >
                        {difference(
                          sum(
                            locationDCA.originalYouthF,
                            locationDCA.originalYouthM
                          ),
                          sum(locationDCA.youthF, locationDCA.youthM)
                        )}
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid #000", textAlign: "center" }}
                      >
                        {difference(
                          sum(
                            locationDCA.originalAdultsF,
                            locationDCA.originalAdultsM
                          ),
                          sum(locationDCA.adultsF, locationDCA.adultsM)
                        )}
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid #000", textAlign: "center" }}
                      >
                        {sum(
                          sum(
                            difference(
                              sum(
                                locationDCA.originalAdultsF,
                                locationDCA.originalAdultsM
                              ),
                              sum(locationDCA.adultsF, locationDCA.adultsM)
                            ),
                            difference(
                              sum(
                                locationDCA.originalYouthF,
                                locationDCA.originalYouthM
                              ),
                              sum(locationDCA.youthF, locationDCA.youthM)
                            )
                          ),
                          difference(
                            sum(
                              locationDCA.originalChildF,
                              locationDCA.originalChildM
                            ),
                            sum(locationDCA.childF, locationDCA.childM)
                          )
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </React.Fragment>
            ) : (
              <></>
            )}
            <TableRow>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Final project reach
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                0
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                0
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                0
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                0
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                0
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                0
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                0
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                0
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                0
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                0
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                0
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                0
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container spacing={6} my={5}>
        <Grid item md={4}>
          <Button
            type="button"
            variant="contained"
            sx={{
              fontWeight: "bolder",
              backgroundColor: "#333333",
              "&:hover": {
                background: "#333333",
                color: "white",
              },
            }}
          >
            <SaveIcon /> &nbsp; Submit for approval
          </Button>
        </Grid>
        <Grid item md={4}>
          <Button
            type="button"
            variant="contained"
            sx={{
              fontWeight: "bolder",
              backgroundColor: "#333333",
              "&:hover": {
                background: "#333333",
                color: "white",
              },
            }}
          >
            <DownloadIcon /> &nbsp; Download project level DCA summary
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
export default ProjectLevelDCASummary;
