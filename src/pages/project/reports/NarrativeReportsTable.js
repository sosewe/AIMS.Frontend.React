import {
  Button as MuiButton,
  Paper,
  TableCell,
  TableRow,
  TextField as MuiTextField,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { useForm } from "react-hook-form";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { green, purple } from "@mui/material/colors";
import DownloadingOutlinedIcon from "@mui/icons-material/DownloadingOutlined";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getCountryReportData,
  getSavedNarrativeReports,
  saveNarrativeReport,
} from "../../../api/internal-reporting";
import { toast } from "react-toastify";
import Papa from "papaparse";
import { OfficeContext } from "../../../App";
import { getProjectById } from "../../../api/project";

const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const theme = createTheme({
  palette: {
    secondary: {
      main: purple[500],
    },
    secondaryGray: {
      main: green[500],
    },
  },
});

const NarrativeReportsTable = ({
  NarrativeReportsResults,
  processLevelItemId,
  implementationYearId,
  implementationMonthId,
}) => {
  const [sumActual, setSumActual] = useState(0);
  const [sumYtD_Perf, setSumYtD_Perf] = useState(0);
  const [sumAnnual_Perf, setSumAnnual_Perf] = useState(0);
  const [projectTitle, setProjectTitle] = useState("");
  const [commentsFromCO, setCommentsFromCO] = useState("");

  const officeContext = useContext(OfficeContext);
  let selectedOffice = officeContext.selectedOffice;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [isSaved, setIsSaved] = useState(false);
  const mutation = useMutation({ mutationFn: saveNarrativeReport });

  const {
    isLoading: isLoadingProjectById,
    isError: isErrorProjectById,
    data: ProjectById,
  } = useQuery(["getProjectById", processLevelItemId], getProjectById, {
    enabled: !!processLevelItemId,
  });
  const { isLoading, isError, data } = useQuery(
    [
      "getSavedNarrativeReports",
      processLevelItemId,
      implementationYearId,
      implementationMonthId,
    ],
    getSavedNarrativeReports,
    {
      enabled:
        !!processLevelItemId &&
        !!implementationYearId &&
        !!implementationMonthId,
    }
  );

  const {
    isLoading: isLoadingCountryReportData,
    isError: isErrorCountryReportData,
    data: CountryReportData,
  } = useQuery(
    ["getCountryReportData", processLevelItemId],
    getCountryReportData,
    {
      enabled: !!processLevelItemId,
    }
  );

  const onSubmit = async (data) => {
    try {
      const InData = {
        overallProjectComments: data.overallProjectComments,
        processLevelItemId: processLevelItemId,
        implementationYearId,
        implementationMonthId,
        serviceContractFrequency: sumActual,
        yTDPerf: sumYtD_Perf,
        annualPerf: sumAnnual_Perf,
        countryOffice: selectedOffice,
        ProjectName: projectTitle,
        datas: [],
      };
      for (const inNarrativeReportKey of NarrativeReportsResults) {
        InData.datas.push({
          indicatorId: inNarrativeReportKey.indicatorId,
          value: data[inNarrativeReportKey.indicatorId],
        });
      }

      await mutation.mutateAsync(InData);
      toast("Successfully Created Narrative Reports", {
        type: "success",
      });
      setIsSaved(true);
    } catch (error) {
      toast(error.response.data, {
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (!isLoading && !isError && data) {
      if (data.data && data.data.length > 0) {
        setValue("overallProjectComments", data.data[0].overallProjectComments);
        for (const datum of data.data[0].narrativeReportDatas) {
          setValue(datum.indicatorId, datum.value);
        }
        setIsSaved(true);
      }
    }

    let actual = 0;
    let ytD_Perf = 0;
    let annual_Perf = 0;
    let count = 0;
    for (const narrativeReportsResult of NarrativeReportsResults) {
      actual += narrativeReportsResult.actual;
      ytD_Perf += narrativeReportsResult.ytD_Perf;
      annual_Perf += narrativeReportsResult.annual_Perf;
      count++;
    }
    setSumActual(actual);
    setSumYtD_Perf(ytD_Perf / count);
    setSumAnnual_Perf(annual_Perf / count);

    if (!isLoadingProjectById && !isErrorProjectById && ProjectById) {
      setProjectTitle(ProjectById.data.shortTitle);
    }
    if (
      !isLoadingCountryReportData &&
      !isErrorCountryReportData &&
      CountryReportData
    ) {
      setCommentsFromCO(CountryReportData.data.comments);
    }
  }, [
    isLoading,
    isError,
    data,
    NarrativeReportsResults,
    isLoadingProjectById,
    isErrorProjectById,
    ProjectById,
    isLoadingCountryReportData,
    isErrorCountryReportData,
    CountryReportData,
  ]);

  const handleDownload = () => {
    const csv = Papa.unparse(NarrativeReportsResults, {
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

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="grouped table">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    border: "1px solid #000",
                    textAlign: "center",
                  }}
                >
                  Indicator
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #000",
                    textAlign: "center",
                  }}
                >
                  Actual
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #000",
                    textAlign: "center",
                  }}
                >
                  YTD Target
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    border: "1px solid #000",
                    textAlign: "center",
                  }}
                >
                  Annual Target
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    border: "1px solid #000",
                    textAlign: "center",
                  }}
                >
                  YTD Perf
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    border: "1px solid #000",
                    textAlign: "center",
                  }}
                >
                  Annual Perf
                </TableCell>
                <TableCell
                  align="center"
                  colSpan={3}
                  sx={{
                    border: "1px solid #000",
                    textAlign: "center",
                  }}
                >
                  Narrative Explanation
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {NarrativeReportsResults.map((data, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell
                      sx={{
                        border: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      {data.indicatorName}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      {data.actual}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      {data.ytdTarget}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      {data.annualTarget}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      {Number(data.ytD_Perf) * 100 + "%"}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      {Number(data.annual_Perf) * 100 + "%"}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      <TextField
                        name={data.indicatorId}
                        multiline
                        fullWidth
                        error={Boolean(
                          errors[data.indicatorId]?.type === "required"
                        )}
                        variant="outlined"
                        {...register(data.indicatorId, {
                          required: "Field is required",
                        })}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell
                  sx={{
                    border: "1px solid #000",
                    textAlign: "center",
                  }}
                  colSpan={7}
                >
                  <TextField
                    name="overallProjectComments"
                    label="Overall Project Comments"
                    multiline
                    fullWidth
                    rows={3}
                    variant="outlined"
                    error={Boolean(
                      errors["overallProjectComments"]?.type === "required"
                    )}
                    {...register("overallProjectComments", {
                      required: "Field is required",
                    })}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{
                    border: "1px solid #000",
                    textAlign: "left",
                  }}
                  colSpan={7}
                >
                  Feedback from CO: {commentsFromCO}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{
                    border: "1px solid #000",
                    textAlign: "center",
                  }}
                  colSpan={4}
                >
                  <ThemeProvider theme={theme}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      mt={2}
                      disabled={isSaved}
                    >
                      Save Narrative Report
                    </Button>
                  </ThemeProvider>
                </TableCell>

                <TableCell
                  sx={{
                    border: "1px solid #000",
                    textAlign: "center",
                  }}
                  colSpan={3}
                >
                  <ThemeProvider theme={theme}>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      mt={2}
                      onClick={() => handleDownload()}
                    >
                      <DownloadingOutlinedIcon />
                      &nbsp;DownLoad
                    </Button>
                  </ThemeProvider>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </form>
    </React.Fragment>
  );
};
export default NarrativeReportsTable;
