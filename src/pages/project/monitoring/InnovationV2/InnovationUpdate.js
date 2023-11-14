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
import { getInnovationMonitoringTargetMetricsByInnovationId } from "../../../../api/innovation-monitoring";
import {
  newInnovationMonitoringUpdateRisk,
  getInnovationMonitoringUpdateRiskByInnovationId,
  deleteInnovationMonitoringUpdateRisk,
} from "../../../../api/innovation-monitoring-risk";
import {
  newInnovationMonitoringUpdateMetric,
  getInnovationMonitoringUpdateMetricByInnovationId,
  deleteInnovationMonitoringUpdateMetric,
} from "../../../../api/innovation-monitoring-metric";

const Paper = styled(MuiPaper)(spacing);
const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Autocomplete = styled(MuiAutocomplete)(spacing);
const Button = styled(MuiButton)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const Divider = styled(MuiDivider)(spacing);

const MetricDetailsForm = ({ handleMetricClick, metric }) => {
  const initialMetricValues = {
    actualByReportingPeriod: "",
    innovationTargetGroupName: metric.innovationTargetGroupName,
    innovationMetricName: metric.innovationMetricName,
    innovationTarget: metric.innovationTarget,
    innovationPercentageChange: "",
  };

  const mutation = useMutation({
    mutationFn: newInnovationMonitoringUpdateMetric,
  });

  const formik = useFormik({
    initialValues: initialMetricValues,
    validationSchema: Yup.object().shape({
      actualByReportingPeriod: Yup.number().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        values.innovationPercentageChange =
          (values.actualByReportingPeriod / values.innovationTarget) * 100;
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
                name="innovationMetricName"
                label="Metric"
                value={formik.values.innovationMetricName}
                error={Boolean(
                  formik.touched.innovationMetricName &&
                    formik.errors.innovationMetricName
                )}
                fullWidth
                helperText={
                  formik.touched.innovationMetricName &&
                  formik.errors.innovationMetricName
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
                rows={3}
                disabled
              />
            </Grid>

            <Grid item md={12}>
              <TextField
                name="innovationTargetGroupName"
                label="Target Group"
                value={formik.values.innovationTargetGroupName}
                error={Boolean(
                  formik.touched.innovationTargetGroupName &&
                    formik.errors.innovationTargetGroupName
                )}
                fullWidth
                helperText={
                  formik.touched.innovationTargetGroupName &&
                  formik.errors.innovationTargetGroupName
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
                rows={3}
                disabled
              />
            </Grid>

            <Grid item md={12}>
              <TextField
                name="innovationTarget"
                label="Target Number"
                value={formik.values.innovationTarget}
                error={Boolean(
                  formik.touched.innovationTarget &&
                    formik.errors.innovationTarget
                )}
                fullWidth
                helperText={
                  formik.touched.innovationTarget &&
                  formik.errors.innovationTarget
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
                rows={3}
                disabled
              />
            </Grid>

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
    initialValues: initialRiskValues,
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
                value={formik.values.riskMitigation}
                error={Boolean(
                  formik.touched.riskMitigation && formik.errors.riskMitigation
                )}
                fullWidth
                helperText={
                  formik.touched.riskMitigation && formik.errors.riskMitigation
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
  const [metric, setMetric] = useState();
  const [pageSize, setPageSize] = useState(5);
  const [openMetricDialog, setOpenMetricDialog] = useState();
  const [openRiskDialog, setOpenRiskDialog] = useState();
  const [innovationRisksList, setInnovationRisksList] = useState([]);
  const [innovationMetricsList, setInnovationMetricsList] = useState([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutationMetric = useMutation({
    mutationFn: newInnovationMonitoringUpdateMetric,
  });

  const mutationRisk = useMutation({
    mutationFn: newInnovationMonitoringUpdateRisk,
  });
  const {
    data: InnovationMetricsData,
    isLoading: isLoadingInnovationMetrics,
    isError: isErrorInnovationMetrics,
    error,
  } = useQuery(
    ["getInnovationMonitoringTargetMetricsByInnovationId"],
    getInnovationMonitoringTargetMetricsByInnovationId,
    {
      refetchOnWindowFocus: false,
    }
  );

  const formik = useFormik({
    validationSchema: Yup.object().shape({}),
    onSubmit: async (values) => {
      try {
        const innovationMetrics = [];
        for (const innovationMetric of innovationMetricsList) {
          const metric = {
            void: false,
          };
          innovationMetrics.push(metric);
        }
        await mutationMetric.mutateAsync(innovationMetrics);

        const innovationRisks = [];
        for (const innovationRisk of innovationRisks) {
          const risk = {
            void: false,
          };
          innovationRisks.push(risk);
        }
        await mutationMetric.mutateAsync(innovationRisks);

        toast("Successfully Updated an Innovation", {
          type: "success",
        });
        await queryClient.invalidateQueries([
          "getInnovationMonitoringTargetMetricsByInnovationId",
        ]);
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
    setInnovationMetricsList((current) =>
      current.filter(
        (metric) => metric.innovationMetricName !== row.innovationMetricName
      )
    );
  }

  const handleAddMetric = (values) => {
    setInnovationMetricsList((current) => [...current, values]);
    queryClient.invalidateQueries([
      "getInnovationMonitoringTargetMetricsByInnovationId",
    ]);
  };

  function handleRemoveRisk(row) {
    setInnovationRisksList((current) =>
      current.filter((risk) => risk.riskDescription !== row.riskDescription)
    );
  }

  const handleAddRisk = (values) => {
    setInnovationRisksList((current) => [...current, values]);
  };

  useEffect(() => {
    function setCurrentFormValues() {}
    setCurrentFormValues();
  }, []);

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
                      isLoadingInnovationMetrics || isErrorInnovationMetrics
                        ? []
                        : InnovationMetricsData
                        ? InnovationMetricsData.data
                        : []
                    }
                    columns={[
                      {
                        field: "innovationMetricName",
                        headerName: "Metric",
                        editable: false,
                        flex: 1,
                      },
                      {
                        field: "innovationTargetGroupName",
                        headerName: "Target Group",
                        editable: false,
                        flex: 1,
                      },
                      {
                        field: "innovationTarget",
                        headerName: "Target Number",
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
                                setMetric(params.row);
                              }}
                            ></Button>
                          </>
                        ),
                      },
                    ]}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    loading={isLoadingInnovationMetrics}
                    components={{ Toolbar: GridToolbar }}
                    getRowHeight={() => "auto"}
                  />
                </div>
              </Paper>
            </Grid>
          </Grid>
          <Grid container item spacing={2} mt={3}>
            <Grid item md={12}>
              <Typography variant="h3" gutterBottom display="inline">
                Actual Metrics By Reporting
              </Typography>
            </Grid>
            <Grid item md={12}>
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Metric</TableCell>
                      <TableCell align="left">Target Group</TableCell>
                      <TableCell align="left">Target Number</TableCell>
                      <TableCell align="left">Actual By Reporting</TableCell>
                      <TableCell align="left">Percentage Change</TableCell>
                      <TableCell align="left">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {innovationMetricsList.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell align="left">
                          {row.innovationMetricName}
                        </TableCell>
                        <TableCell align="left">
                          {row.innovationTargetGroupName}
                        </TableCell>
                        <TableCell align="left">
                          {row.innovationTarget}
                        </TableCell>
                        <TableCell align="left">
                          {row.actualByReportingPeriod}
                        </TableCell>
                        <TableCell align="left">
                          {row.innovationPercentageChange}%
                        </TableCell>
                        <TableCell align="left">
                          <Button
                            startIcon={<TrashIcon />}
                            size="small"
                            onClick={() => handleRemoveMetric(row)}
                          ></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                    <TableCell align="left">Risk</TableCell>
                    <TableCell align="left">Mitigation</TableCell>
                    <TableCell align="left">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {innovationRisksList.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell align="left">{row.riskDescription}</TableCell>
                      <TableCell align="left">{row.riskMitigation}</TableCell>
                      <TableCell align="left">
                        <Button
                          startIcon={<TrashIcon />}
                          size="small"
                          onClick={() => handleRemoveRisk(row)}
                        ></Button>
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
              <MetricDetailsForm
                handleMetricClick={handleAddMetric}
                metric={metric}
              />
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
