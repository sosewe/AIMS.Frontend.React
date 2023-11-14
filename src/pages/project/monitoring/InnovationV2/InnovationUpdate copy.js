import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField as MuiTextField,
  Autocomplete as MuiAutocomplete,
  Typography,
  Link,
  MenuItem,
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Box,
  CircularProgress,
  Paper as MuiPaper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import * as Yup from "yup";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Check, Trash as TrashIcon } from "react-feather";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Link2 } from "react-feather";
import { Helmet } from "react-helmet-async";
import { Guid } from "../../../../utils/guid";
import { getInnovations } from "../../../../api/innovation";
import {
  newInnovationMonitoringUpdateRisk,
  getInnovationMonitoringUpdateRiskByInnovationId,
  deleteInnovationMonitoringUpdateRisk,
} from "../../../../api/innovation-monitoring-risk";
import {
  newInnovationMonitoringUpdateObjective,
  getInnovationMonitoringUpdateObjectiveByInnovationId,
  deleteInnovationMonitoringUpdateObjective,
} from "../../../../api/innovation-monitoring-objective";

const Paper = styled(MuiPaper)(spacing);
const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Autocomplete = styled(MuiAutocomplete)(spacing);
const Button = styled(MuiButton)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const Divider = styled(MuiDivider)(spacing);

const initialMetricValues = {
  metric: "",
  targetGroup: "",
  targetValue: "",
  actualByReportingPeriod: "",
  percentageChange: "",
  description: "",
};

const MetricDetailsForm = ({ handleMetricClick }) => {
  const formik = useFormik({
    initialMetricValues: initialMetricValues,
    validationSchema: Yup.object().shape({
      metric: Yup.object().required("Required"),
      targetGroup: Yup.object().required("Required"),
      targetValue: Yup.number().required("Required"),
      actualByReportingPeriod: Yup.number().required("Required"),
      percentageChange: Yup.number().required("Required"),
      description: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        handleMetricClick(values);
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      } finally {
        resetForm();
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={12}>
              <TextField
                name="actualByReportingPeriod"
                label="Actual By Reporting Period"
                value={formik.values.actualByReportingPeriod}
                error={Boolean(
                  formik.touched.actualByReportingPeriod &&
                    formik.errors.actualByReportingPeriod
                )}
                fullWidth
                helperText={
                  formik.touched.actualByReportingPeriod &&
                  formik.errors.actualByReportingPeriod
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
                rows={3}
              />
            </Grid>

            <Grid item md={1}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                mt={3}
              >
                Update
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

const initialRiskValues = {
  riskDescription: "",
  riskMitigation: "",
};

const RiskDetailsForm = ({ handleRiskClick }) => {
  const formik = useFormik({
    initialMetricValues: initialRiskValues,
    validationSchema: Yup.object().shape({
      riskDescription: Yup.string().required("Required"),
      riskMitigation: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        handleRiskClick(values);
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      } finally {
        resetForm();
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={12}>
              <TextField
                name="riskDescription"
                label="Risk Description"
                value={formik.values.riskDescription}
                error={Boolean(
                  formik.touched.riskDescription &&
                    formik.errors.riskDescription
                )}
                fullWidth
                helperText={
                  formik.touched.riskDescription &&
                  formik.errors.riskDescription
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                multiline
                variant="outlined"
                my={2}
                rows={3}
              />
            </Grid>

            <Grid item md={12}>
              <TextField
                name="riskMitigation"
                label="Risk Mitigation"
                value={formik.values.riskDescription}
                error={Boolean(
                  formik.touched.riskDescription &&
                    formik.errors.riskDescription
                )}
                fullWidth
                helperText={
                  formik.touched.riskDescription &&
                  formik.errors.riskDescription
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                multiline
                variant="outlined"
                my={2}
                rows={3}
              />
            </Grid>

            <Grid item md={4}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth=""
                mt={3}
              >
                Update
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

const InnovationUpdateForm = ({ id }) => {
  const [pageSize, setPageSize] = useState(5);
  const [openMetricDialog, setOpenMetricDialog] = useState();
  const [openRiskDialog, setOpenRiskDialog] = useState();
  const [innovationRisksList, setInnovationRisksList] = useState([]);
  const [innovationMetricsList, setInnovationMetricsList] = useState([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutationRisk = useMutation({
    mutationFn: newInnovationMonitoringUpdateRisk,
  });
  const mutationObjective = useMutation({
    mutationFn: newInnovationMonitoringUpdateObjective,
  });
  const {
    data: InnovationsData,
    isLoading: isLoadingInnovations,
    isError: isErrorInnovations,
    error,
  } = useQuery(["getInnovations"], getInnovations, {
    refetchOnWindowFocus: false,
  });

  const formik = useFormik({
    validationSchema: Yup.object().shape({}),
    onSubmit: async (values) => {
      try {
        const saveObjective = {};
        const saveRisk = {};

        toast("Successfully Updated an Innovation", {
          type: "success",
        });
        await queryClient.invalidateQueries(["getInnovations"]);
        navigate(`/project/design/innovation/innovation-detail/${id}`);
      } catch (error) {
        console.log(error);
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  function handleRemoveMetric(row) {
    setInnovationMetricsList((current) => {});
  }

  const handleAddMetric = (values) => {
    setInnovationMetricsList((current) => [...current, values]);
  };

  function handleRemoveRisk(row) {
    setInnovationRisksList((current) => {});
  }

  const handleAddRisk = (values) => {
    setInnovationRisksList((current) => [...current, values]);
  };

  useEffect(() => {}, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      {formik.isSubmitting ? (
        <Box display="flex" justifyContent="center" my={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container item spacing={2}>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <Paper>
                <div style={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rowsPerPageOptions={[5, 10, 25]}
                    rows={
                      isLoadingInnovations || isErrorInnovations
                        ? []
                        : InnovationsData
                        ? InnovationsData.data
                        : []
                    }
                    columns={[
                      {
                        field: "title",
                        headerName: "Metric",
                        editable: false,
                        flex: 1,
                      },
                      {
                        field: "shortTitle",
                        headerName: "Target Group",
                        editable: false,
                        flex: 1,
                      },
                      {
                        field: "costCenter",
                        headerName: "Actual By Reporting Period",
                        editable: false,
                        flex: 1,
                      },
                      {
                        field: "Office",
                        headerName: "% Change",
                        editable: false,
                        flex: 1,
                      },
                      {
                        field: "action",
                        headerName: "Action",
                        sortable: false,
                        flex: 1,
                        renderCell: (params) => (
                          <>
                            <Button
                              startIcon={<Link2 />}
                              size="small"
                              onClick={() => {
                                setOpenMetricDialog(true);
                              }}
                            ></Button>
                          </>
                        ),
                      },
                    ]}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    loading={isLoadingInnovations}
                    components={{ Toolbar: GridToolbar }}
                    getRowHeight={() => "auto"}
                  />
                </div>
              </Paper>
            </Grid>
          </Grid>
          <Grid container spacing={12} pt={10}>
            <Grid item md={12} my={2}>
              <Typography variant="h3" gutterBottom display="inline">
                Risks Observed
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenRiskDialog(true)}
              >
                <AddIcon /> Add Risk
              </Button>
            </Grid>
          </Grid>
          <Grid item md={12}>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Risk</TableCell>
                    <TableCell align="right">Mitigation</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {innovationRisksList.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell align="right">
                        {row.staffDetailsWorkFlowTask.roleName}
                      </TableCell>
                      <TableCell align="right">
                        {row.primaryRole ? "Yes" : "No"}
                      </TableCell>
                      <TableCell align="right">
                        <Button startIcon={<TrashIcon />} size="small"></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>

          <Grid item mt={5} md={12}>
            <Button type="submit" variant="contained" color="primary" mt={3}>
              <Check /> Save changes
            </Button>
          </Grid>
          <Dialog
            fullWidth={true}
            maxWidth="md"
            open={openMetricDialog}
            onClose={() => setOpenMetricDialog(false)}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              Add Innovation Update Details
            </DialogTitle>
            <DialogContent>
              <MetricDetailsForm handleMetricClick={handleAddMetric} />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenMetricDialog(false)}
                color="primary"
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            fullWidth={true}
            maxWidth="md"
            open={openRiskDialog}
            onClose={() => setOpenRiskDialog(false)}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Add Risk Details</DialogTitle>
            <DialogContent>
              <RiskDetailsForm handleRiskClick={handleAddRisk} />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenRiskDialog(false)} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      )}
    </form>
  );
};

const InnovationUpdate = () => {
  let { id } = useParams();
  return (
    <React.Fragment>
      <Helmet title="New Innovation Monitoring" />
      <Typography variant="h3" gutterBottom display="inline">
        Innovation Update
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link>Project Monitoring</Link>
        <Typography>Innovation Update</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <InnovationUpdateForm id={id} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default InnovationUpdate;
