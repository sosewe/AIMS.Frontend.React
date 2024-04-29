import React, { useContext, useState } from "react";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import { getLookupMasterItemsByName } from "../../../api/lookup";
import { green, purple } from "@mui/material/colors";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { getAllProjectsDCA } from "../../../api/internal-reporting";
import TableBody from "@mui/material/TableBody";
import { OfficeContext } from "../../../App";
import { useForm } from "react-hook-form";
import DownloadIcon from "@mui/icons-material/Download";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
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

const CountryLevelDCA = () => {
  const [implementationYear, setImplementationYear] = useState();
  const [implementationYearId, setImplementationYearId] = useState();
  const officeContext = useContext(OfficeContext);
  const selectedOffice = officeContext.selectedOffice;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const {
    data: implementationYears,
    isLoading,
    isError,
  } = useQuery(
    ["ImplementationYear", "ImplementationYear"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const {
    isLoading: isLoadingAllProjectsDCA,
    isError: isErrorAllProjectsDCA,
    data: AllProjectsDCAData,
  } = useQuery(
    ["getAllProjectsDCA", implementationYearId, selectedOffice],
    getAllProjectsDCA,
    {
      enabled: !!implementationYearId && !!selectedOffice,
    }
  );

  const formik = useFormik({
    initialValues: { implementationYear: "" },
    validationSchema: Yup.object().shape({
      implementationYear: Yup.object().required("Required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setImplementationYear(values.implementationYear.lookupItemName);
        setImplementationYearId(values.implementationYear.lookupItemId);
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
  };

  return (
    <React.Fragment>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom display="inline">
            Country Level DCA
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={6}>
              <Grid item md={4}>
                <TextField
                  name="implementationYear"
                  label="Implementation Year"
                  select
                  value={formik.values.implementationYear}
                  error={Boolean(
                    formik.touched.implementationYear &&
                      formik.errors.implementationYear
                  )}
                  fullWidth
                  helperText={
                    formik.touched.implementationYear &&
                    formik.errors.implementationYear
                  }
                  onBlur={formik.handleBlur}
                  onChange={(e) => {
                    formik.handleChange(e);
                    // setCanDownload(false);
                  }}
                  variant="outlined"
                  my={2}
                >
                  <MenuItem disabled value="">
                    Select Implementation Year
                  </MenuItem>
                  {!isLoading && !isError
                    ? implementationYears.data.map((option) => (
                        <MenuItem key={option.lookupItemId} value={option}>
                          {option.lookupItemName}
                        </MenuItem>
                      ))
                    : []}
                </TextField>
              </Grid>
              <Grid item md={4}>
                <ThemeProvider theme={theme}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    mt={2}
                  >
                    SUBMIT
                  </Button>
                </ThemeProvider>
              </Grid>
            </Grid>
          </form>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={12}>
              <Grid item md={12}>
                <TableContainer component={Paper}>
                  <Table size="small" aria-label="grouped table">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Project
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Location
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Original Child
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Original Youth
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Original Adults
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Original Total
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Adjusted Child
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Adjusted Youth
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Adjusted Adult
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Adjusted Total
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Project Final Child
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Project Final Youth
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Project Final Adult
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Project Final Total
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Project Comments
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {!isLoadingAllProjectsDCA && !isErrorAllProjectsDCA ? (
                        <React.Fragment>
                          {AllProjectsDCAData.data.map((projectDCA, index) => {
                            return (
                              <TableRow key={index}>
                                <TableCell
                                  sx={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                  }}
                                >
                                  {projectDCA.shortTitle}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                  }}
                                >
                                  All
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                  }}
                                >
                                  {projectDCA.originalChild}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                  }}
                                >
                                  {projectDCA.originalYouth}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                  }}
                                >
                                  {projectDCA.originalAdult}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                  }}
                                >
                                  {projectDCA.originalTotal}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                  }}
                                >
                                  {projectDCA.adjustedChild}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                  }}
                                >
                                  {projectDCA.adjustedYouth}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                  }}
                                >
                                  {projectDCA.adjustedAdult}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                  }}
                                >
                                  {projectDCA.adjustedTotal}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                  }}
                                >
                                  {projectDCA.finalChild}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                  }}
                                >
                                  {projectDCA.finalYouth}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                  }}
                                >
                                  {projectDCA.finalAdult}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                  }}
                                >
                                  {projectDCA.finalTotal}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                  }}
                                >
                                  <TextField
                                    name={projectDCA.projectId}
                                    label="Comments"
                                    error={Boolean(
                                      errors[projectDCA.projectId]?.type ===
                                        "required"
                                    )}
                                    fullWidth
                                    variant="outlined"
                                    {...register(projectDCA.projectId, {
                                      required: "Field is required",
                                    })}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                          <TableRow></TableRow>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <TableCell
                            sx={{
                              border: "1px solid #000",
                              textAlign: "center",
                            }}
                            colSpan={7}
                          >
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
                              // onClick={() => downloadProjectLevelDCASummary()}
                            >
                              <DownloadIcon /> &nbsp; Download project level DCA
                              summary
                            </Button>
                          </TableCell>
                        </React.Fragment>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};
export default CountryLevelDCA;
