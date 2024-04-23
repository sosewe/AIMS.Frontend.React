import {
  Button as MuiButton,
  Paper,
  TableCell,
  TableRow,
  TextField as MuiTextField,
} from "@mui/material";
import React from "react";
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(NarrativeReportsResults);
    console.log(data);
    const InData = {
      overallProjectComments: data.overallProjectComments,
      processLevelItemId: processLevelItemId,
      implementationYearId,
      implementationMonthId,
      datas: [],
    };
    for (const inNarrativeReportKey of NarrativeReportsResults) {
      InData.datas.push({
        indicatorId: inNarrativeReportKey.indicatorId,
        value: data[inNarrativeReportKey.indicatorId],
      });
    }

    console.log(InData);
  };

  const handleDownload = () => {};

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
                  Feedback from CO:
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
