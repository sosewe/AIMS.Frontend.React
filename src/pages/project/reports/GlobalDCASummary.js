import React, { useContext, useState } from "react";
import styled from "@emotion/styled";
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
import { spacing } from "@mui/system";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getLookupMasterItemsByName } from "../../../api/lookup";
import { green, purple } from "@mui/material/colors";
import TableContainer from "@mui/material/TableContainer";
import TableBody from "@mui/material/TableBody";
import DownloadIcon from "@mui/icons-material/Download";
import { useForm } from "react-hook-form";

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

const GlobalDCASummary = () => {
  const [implementationYear, setImplementationYear] = useState();
  const [implementationYearId, setImplementationYearId] = useState();

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
            Global DCA Summary
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
                          Country
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Country projects total child
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Country projects total youth
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Country projects total adult
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Country Projects total
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Country Adjusted child
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Country Adjusted youth
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Country Adjusted adult
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Country Adjusted Total
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Country Final child
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Country Final youth
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Country Final adult
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Country Final Total
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid #000", textAlign: "center" }}
                        >
                          Country Comments
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    {/*<TableBody>*/}
                    {/*  {!isLoadingAllProjectsDCA && !isErrorAllProjectsDCA ? (*/}
                    {/*    <React.Fragment>*/}
                    {/*      {AllProjectsDCAData.data.map((projectDCA, index) => {*/}
                    {/*        return (*/}
                    {/*          <TableRow key={index}>*/}
                    {/*            <TableCell*/}
                    {/*              sx={{*/}
                    {/*                border: "1px solid #000",*/}
                    {/*                textAlign: "center",*/}
                    {/*              }}*/}
                    {/*            >*/}
                    {/*              {projectDCA.shortTitle}*/}
                    {/*            </TableCell>*/}
                    {/*            <TableCell*/}
                    {/*              sx={{*/}
                    {/*                border: "1px solid #000",*/}
                    {/*                textAlign: "center",*/}
                    {/*              }}*/}
                    {/*            >*/}
                    {/*              All*/}
                    {/*            </TableCell>*/}
                    {/*            <TableCell*/}
                    {/*              sx={{*/}
                    {/*                border: "1px solid #000",*/}
                    {/*                textAlign: "center",*/}
                    {/*              }}*/}
                    {/*            >*/}
                    {/*              {projectDCA.originalChild}*/}
                    {/*            </TableCell>*/}
                    {/*            <TableCell*/}
                    {/*              sx={{*/}
                    {/*                border: "1px solid #000",*/}
                    {/*                textAlign: "center",*/}
                    {/*              }}*/}
                    {/*            >*/}
                    {/*              {projectDCA.originalYouth}*/}
                    {/*            </TableCell>*/}
                    {/*            <TableCell*/}
                    {/*              sx={{*/}
                    {/*                border: "1px solid #000",*/}
                    {/*                textAlign: "center",*/}
                    {/*              }}*/}
                    {/*            >*/}
                    {/*              {projectDCA.originalAdult}*/}
                    {/*            </TableCell>*/}
                    {/*            <TableCell*/}
                    {/*              sx={{*/}
                    {/*                border: "1px solid #000",*/}
                    {/*                textAlign: "center",*/}
                    {/*              }}*/}
                    {/*            >*/}
                    {/*              {projectDCA.originalTotal}*/}
                    {/*            </TableCell>*/}
                    {/*            <TableCell*/}
                    {/*              sx={{*/}
                    {/*                border: "1px solid #000",*/}
                    {/*                textAlign: "center",*/}
                    {/*              }}*/}
                    {/*            >*/}
                    {/*              {projectDCA.adjustedChild}*/}
                    {/*            </TableCell>*/}
                    {/*            <TableCell*/}
                    {/*              sx={{*/}
                    {/*                border: "1px solid #000",*/}
                    {/*                textAlign: "center",*/}
                    {/*              }}*/}
                    {/*            >*/}
                    {/*              {projectDCA.adjustedYouth}*/}
                    {/*            </TableCell>*/}
                    {/*            <TableCell*/}
                    {/*              sx={{*/}
                    {/*                border: "1px solid #000",*/}
                    {/*                textAlign: "center",*/}
                    {/*              }}*/}
                    {/*            >*/}
                    {/*              {projectDCA.adjustedAdult}*/}
                    {/*            </TableCell>*/}
                    {/*            <TableCell*/}
                    {/*              sx={{*/}
                    {/*                border: "1px solid #000",*/}
                    {/*                textAlign: "center",*/}
                    {/*              }}*/}
                    {/*            >*/}
                    {/*              {projectDCA.adjustedTotal}*/}
                    {/*            </TableCell>*/}
                    {/*            <TableCell*/}
                    {/*              sx={{*/}
                    {/*                border: "1px solid #000",*/}
                    {/*                textAlign: "center",*/}
                    {/*              }}*/}
                    {/*            >*/}
                    {/*              {projectDCA.finalChild}*/}
                    {/*            </TableCell>*/}
                    {/*            <TableCell*/}
                    {/*              sx={{*/}
                    {/*                border: "1px solid #000",*/}
                    {/*                textAlign: "center",*/}
                    {/*              }}*/}
                    {/*            >*/}
                    {/*              {projectDCA.finalYouth}*/}
                    {/*            </TableCell>*/}
                    {/*            <TableCell*/}
                    {/*              sx={{*/}
                    {/*                border: "1px solid #000",*/}
                    {/*                textAlign: "center",*/}
                    {/*              }}*/}
                    {/*            >*/}
                    {/*              {projectDCA.finalAdult}*/}
                    {/*            </TableCell>*/}
                    {/*            <TableCell*/}
                    {/*              sx={{*/}
                    {/*                border: "1px solid #000",*/}
                    {/*                textAlign: "center",*/}
                    {/*              }}*/}
                    {/*            >*/}
                    {/*              {projectDCA.finalTotal}*/}
                    {/*            </TableCell>*/}
                    {/*            <TableCell*/}
                    {/*              sx={{*/}
                    {/*                border: "1px solid #000",*/}
                    {/*                textAlign: "center",*/}
                    {/*              }}*/}
                    {/*            >*/}
                    {/*              <TextField*/}
                    {/*                name={projectDCA.projectId}*/}
                    {/*                label="Comments"*/}
                    {/*                error={Boolean(*/}
                    {/*                  errors[projectDCA.projectId]?.type ===*/}
                    {/*                    "required"*/}
                    {/*                )}*/}
                    {/*                fullWidth*/}
                    {/*                variant="outlined"*/}
                    {/*                {...register(projectDCA.projectId, {*/}
                    {/*                  required: "Field is required",*/}
                    {/*                })}*/}
                    {/*              />*/}
                    {/*            </TableCell>*/}
                    {/*          </TableRow>*/}
                    {/*        );*/}
                    {/*      })}*/}
                    {/*      <TableRow></TableRow>*/}
                    {/*    </React.Fragment>*/}
                    {/*  ) : (*/}
                    {/*    <React.Fragment>*/}
                    {/*      <TableCell*/}
                    {/*        sx={{*/}
                    {/*          border: "1px solid #000",*/}
                    {/*          textAlign: "center",*/}
                    {/*        }}*/}
                    {/*        colSpan={7}*/}
                    {/*      >*/}
                    {/*        <Button*/}
                    {/*          type="button"*/}
                    {/*          variant="contained"*/}
                    {/*          sx={{*/}
                    {/*            fontWeight: "bolder",*/}
                    {/*            backgroundColor: "#333333",*/}
                    {/*            "&:hover": {*/}
                    {/*              background: "#333333",*/}
                    {/*              color: "white",*/}
                    {/*            },*/}
                    {/*          }}*/}
                    {/*          // onClick={() => downloadProjectLevelDCASummary()}*/}
                    {/*        >*/}
                    {/*          <DownloadIcon /> &nbsp; Download project level DCA*/}
                    {/*          summary*/}
                    {/*        </Button>*/}
                    {/*      </TableCell>*/}
                    {/*    </React.Fragment>*/}
                    {/*  )}*/}
                    {/*</TableBody>*/}
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
export default GlobalDCASummary;
