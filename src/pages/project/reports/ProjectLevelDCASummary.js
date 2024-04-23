import React, { useEffect, useState } from "react";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getLocationBasedDCA,
  getProjectLevelDCA,
  projectLevelDCA,
} from "../../../api/internal-reporting";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/Download";
import useKeyCloakAuth from "../../../hooks/useKeyCloakAuth";
import { toast } from "react-toastify";
import Papa from "papaparse";

const ProjectLevelDCASummaryTable = ({
  processLevelItemId,
  implementationYearId,
}) => {
  const [finalChildReach, setFinalChildReach] = useState(0);
  const [finalYouthReach, setFinalYouthReach] = useState(0);
  const [finalAdultReach, setFinalAdultReach] = useState(0);
  const [finalTotalReach, setFinalTotalReach] = useState(0);
  const [adjustedChildReach, setAdjustedChildReach] = useState(0);
  const [adjustedYouthReach, setAdjustedYouthReach] = useState(0);
  const [adjustedAdultReach, setAdjustedAdultReach] = useState(0);
  const [adjustedTotalReach, setAdjustedTotalReach] = useState(0);
  const [finalChild, setFinalChild] = useState(0);
  const [finalYouth, setFinalYouth] = useState(0);
  const [finalAdult, setFinalAdult] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const { isLoading, isError, data } = useQuery(
    ["getLocationBasedDCA", processLevelItemId, implementationYearId],
    getLocationBasedDCA,
    {
      enabled: !!processLevelItemId && !!implementationYearId,
    }
  );

  const sum = (val, val2) => {
    return Number(val) + Number(val2);
  };

  const difference = (val, val2) => {
    return Number(val) - Number(val2);
  };

  useEffect(() => {
    if (!isLoading && !isError && data) {
      let childNewValue = 0;
      let youthNewValue = 0;
      let adultNewValue = 0;
      let totalReach = 0;
      let adjustedChildReachVal = 0;
      let adjustedYouthReachVal = 0;
      let adjustedAdultReachVal = 0;
      let adjustedTotalReachVal = 0;
      let finalChildVal = 0;
      let finalYouthVal = 0;
      let finalAdultVal = 0;
      let finalTotalVal = 0;
      for (const dataVal of data.data) {
        childNewValue += dataVal.originalChildF + dataVal.originalChildM;
        youthNewValue += dataVal.originalYouthF + dataVal.originalYouthM;
        adultNewValue += dataVal.originalAdultsF + dataVal.originalAdultsM;
        totalReach += childNewValue + youthNewValue + adultNewValue;
        adjustedChildReachVal += dataVal.childF + dataVal.childM;
        adjustedYouthReachVal += dataVal.youthF + dataVal.youthM;
        adjustedAdultReachVal += dataVal.adultsF + dataVal.adultsM;
        adjustedTotalReachVal +=
          adjustedChildReachVal + adjustedYouthReachVal + adjustedAdultReachVal;
        finalChildVal += childNewValue - adjustedChildReachVal;
        finalYouthVal += youthNewValue - adjustedYouthReachVal;
        finalAdultVal += adultNewValue - adjustedAdultReachVal;
        finalTotalVal += totalReach - adjustedTotalReachVal;
        setFinalChildReach(childNewValue);
        setFinalYouthReach(youthNewValue);
        setFinalAdultReach(adultNewValue);
        setFinalTotalReach(totalReach);
        setAdjustedChildReach(adjustedChildReachVal);
        setAdjustedYouthReach(adjustedYouthReachVal);
        setAdjustedAdultReach(adjustedAdultReachVal);
        setAdjustedTotalReach(adjustedTotalReachVal);
        setFinalChild(finalChildVal);
        setFinalYouth(finalYouthVal);
        setFinalAdult(finalAdultVal);
        setFinalTotal(finalTotalVal);
      }
    }
  }, [isLoading, isError]);

  return (
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
              {finalChildReach}
            </TableCell>
            <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
              {finalYouthReach}
            </TableCell>
            <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
              {finalAdultReach}
            </TableCell>
            <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
              {finalTotalReach}
            </TableCell>
            <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
              {adjustedChildReach}
            </TableCell>
            <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
              {adjustedYouthReach}
            </TableCell>
            <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
              {adjustedAdultReach}
            </TableCell>
            <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
              {adjustedTotalReach}
            </TableCell>
            <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
              {finalChild}
            </TableCell>
            <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
              {finalYouth}
            </TableCell>
            <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
              {finalAdult}
            </TableCell>
            <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
              {finalTotal}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const ProjectLevelDCASummary = ({
  processLevelItemId,
  implementationYearId,
}) => {
  const user = useKeyCloakAuth();
  const [data, setData] = useState([]);
  const [enableSubmitForApproval, setEnableSubmitForApproval] = useState(true);

  const downloadProjectLevelDCASummary = () => {
    const csv = Papa.unparse(data, {
      header: true,
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const {
    isLoading: isLoadingDCA,
    isError: isErrorDCA,
    data: DCAdata,
  } = useQuery(
    ["getLocationBasedDCA", processLevelItemId, implementationYearId],
    getLocationBasedDCA,
    {
      enabled: !!processLevelItemId && !!implementationYearId,
    }
  );

  const {
    isLoading: isLoadingProjectLevelDCA,
    isError: isErrorProjectLevelDCA,
    data: ProjectLevelDCA,
  } = useQuery(
    ["getProjectLevelDCA", processLevelItemId, implementationYearId],
    getProjectLevelDCA,
    {
      enabled: !!processLevelItemId && !!implementationYearId,
    }
  );

  const mutation = useMutation({ mutationFn: projectLevelDCA });

  useEffect(() => {
    if (!isLoadingDCA && !isErrorDCA && DCAdata) {
      const dataArray = [];
      let childNewValue = 0;
      let youthNewValue = 0;
      let adultNewValue = 0;
      let totalReach = 0;
      let adjustedChildReachVal = 0;
      let adjustedYouthReachVal = 0;
      let adjustedAdultReachVal = 0;
      let adjustedTotalReachVal = 0;
      let finalChildVal = 0;
      let finalYouthVal = 0;
      let finalAdultVal = 0;
      let finalTotalVal = 0;
      for (const dataVal of DCAdata.data) {
        childNewValue += dataVal.originalChildF + dataVal.originalChildM;
        youthNewValue += dataVal.originalYouthF + dataVal.originalYouthM;
        adultNewValue += dataVal.originalAdultsF + dataVal.originalAdultsM;
        totalReach += childNewValue + youthNewValue + adultNewValue;
        adjustedChildReachVal += dataVal.childF + dataVal.childM;
        adjustedYouthReachVal += dataVal.youthF + dataVal.youthM;
        adjustedAdultReachVal += dataVal.adultsF + dataVal.adultsM;
        adjustedTotalReachVal +=
          adjustedChildReachVal + adjustedYouthReachVal + adjustedAdultReachVal;
        finalChildVal += childNewValue - adjustedChildReachVal;
        finalYouthVal += youthNewValue - adjustedYouthReachVal;
        finalAdultVal += adultNewValue - adjustedAdultReachVal;
        finalTotalVal += totalReach - adjustedTotalReachVal;

        dataArray.push({
          location: dataVal.administrativeUnit,
          "original child": dataVal.originalChildF + dataVal.originalChildM,
          "original youth": dataVal.originalYouthF + dataVal.originalYouthM,
          "original adult": dataVal.originalAdultsF + dataVal.originalAdultsM,
          "original total":
            dataVal.originalChildF +
            dataVal.originalChildM +
            dataVal.originalYouthF +
            dataVal.originalYouthM +
            dataVal.originalAdultsF +
            dataVal.originalAdultsM,
          "adjusted child": dataVal.childF + dataVal.childM,
          "adjusted youth": dataVal.youthF + dataVal.youthM,
          "adjusted adult": dataVal.adultsF + dataVal.adultsM,
          "adjusted total":
            dataVal.childF +
            dataVal.childM +
            dataVal.youthF +
            dataVal.youthM +
            dataVal.adultsF +
            dataVal.adultsM,
          "final child":
            dataVal.originalChildF +
            dataVal.originalChildM -
            (dataVal.childF + dataVal.childM),
          "final youth":
            dataVal.originalYouthF +
            dataVal.originalYouthM -
            (dataVal.youthF + dataVal.youthM),
          "final adult":
            dataVal.originalAdultsF +
            dataVal.originalAdultsM -
            (dataVal.adultsF + dataVal.adultsM),
          "final total":
            dataVal.originalChildF +
            dataVal.originalChildM +
            dataVal.originalYouthF +
            dataVal.originalYouthM +
            dataVal.originalAdultsF +
            dataVal.originalAdultsM -
            (dataVal.childF +
              dataVal.childM +
              dataVal.youthF +
              dataVal.youthM +
              dataVal.adultsF +
              dataVal.adultsM),
        });
      }

      dataArray.push({
        location: "Final project reach",
        "original child": childNewValue,
        "original youth": youthNewValue,
        "original adult": adultNewValue,
        "original total": totalReach,
        "adjusted child": adjustedChildReachVal,
        "adjusted youth": adjustedYouthReachVal,
        "adjusted adult": adjustedAdultReachVal,
        "adjusted total": adjustedTotalReachVal,
        "final child": finalChildVal,
        "final youth": finalYouthVal,
        "final adult": finalAdultVal,
        "final total": finalTotalVal,
      });

      setData(dataArray);
    }

    if (
      !isLoadingProjectLevelDCA &&
      !isErrorProjectLevelDCA &&
      ProjectLevelDCA
    ) {
      setEnableSubmitForApproval(false);
    }
  }, [
    isLoadingDCA,
    isErrorDCA,
    DCAdata,
    isLoadingProjectLevelDCA,
    isErrorProjectLevelDCA,
    ProjectLevelDCA,
  ]);

  const onSaveProjectLevelDCA = async () => {
    try {
      let InData = [];
      for (const datum of data) {
        if (datum.location !== "Final project reach") {
          InData.push({
            createDate: new Date(),
            userId: user.id,
            processLevelItemId: processLevelItemId,
            implementingYearId: implementationYearId,
            administrativeUnit: datum.location,
            originalChild: datum["original child"],
            originalYouth: datum["original youth"],
            originalAdult: datum["original adult"],
            originalTotal: datum["original total"],
            adjustedChild: datum["adjusted child"],
            adjustedYouth: datum["adjusted youth"],
            adjustedAdult: datum["adjusted adult"],
            adjustedTotal: datum["adjusted total"],
            finalChild: datum["final child"],
            finalYouth: datum["final youth"],
            finalAdult: datum["final adult"],
            finalTotal: datum["final total"],
          });
        }
      }
      await mutation.mutateAsync(InData);
      toast("Successfully Saved Project Level DCA", {
        type: "success",
      });
    } catch (error) {
      toast(error.response.data, {
        type: "error",
      });
    }
  };

  return (
    <React.Fragment>
      <ProjectLevelDCASummaryTable
        processLevelItemId={processLevelItemId}
        implementationYearId={implementationYearId}
      />
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
            onClick={() => onSaveProjectLevelDCA()}
            disabled={!enableSubmitForApproval}
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
            onClick={() => downloadProjectLevelDCASummary()}
          >
            <DownloadIcon /> &nbsp; Download project level DCA summary
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
export default ProjectLevelDCASummary;
