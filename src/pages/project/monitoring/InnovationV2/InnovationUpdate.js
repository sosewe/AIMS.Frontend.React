import React, { useEffect, useState, useCallback } from "react";
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
import { Add as AddIcon } from "@mui/icons-material";
import * as Yup from "yup";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Check, Trash as TrashIcon, Edit2 } from "react-feather";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Guid } from "../../../../utils/guid";
import { getInnovationByMonitoringPeriod } from "../../../../api/innovation";
import { newInnovationMonitoringUpdateRisk } from "../../../../api/innovation-monitoring-risk";
import {
  newInnovationMonitoringUpdateMetric,
  getInnovationMonitoringTargetMetricsByReportId,
} from "../../../../api/innovation-monitoring-metric";
import { getInnovationMonitoringTargetMetricsByInnovationId } from "../../../../api/innovation-monitoring";

const Paper = styled(MuiPaper)(spacing);
const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const Divider = styled(MuiDivider)(spacing);

const RiskDetailsForm = ({
  innovationId,
  locationId,
  reportPeriod,
  year,
  handleRiskClick,
}) => {
  const initialRiskValues = {
    innovationId: innovationId,
    administrativeUnitId: locationId,
    reportingFrequencyId: reportPeriod,
    implementationYear: year,
    riskDescription: "",
    riskMitigation: "",
  };

  const formik = useFormik({
    initialValues: initialRiskValues,
    validationSchema: Yup.object().shape({
      riskDescription: Yup.string().required("Required"),
      riskMitigation: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        values.innovationId = innovationId;
        values.administrativeUnitId = locationId;
        values.reportingFrequencyId = reportPeriod;
        values.implementationYear = year;
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

const MetricDetailsForm = ({
  innovationId,
  locationId,
  reportPeriod,
  year,
  handleMetricClick,
  metric,
  metricReportId,
}) => {
  const queryClient = useQueryClient();
  const initialMetricValues = {
    innovationId: innovationId,
    administrativeUnitId: locationId,
    reportingFrequencyId: reportPeriod,
    implementationYear: year,
    innovationMetricId: metric.id,
    actualByReportingPeriod: "",
    innovationMetricDescription: "",
    innovationTargetGroupName: metric.innovationTargetGroupName,
    innovationMetricName: metric.innovationMetricName,
    innovationTarget: metric.innovationTarget,
    innovationPercentageChange: "",
  };

  const {
    data: innovationMetricsReport,
    isLoading: isLoadingInnovationMetricsReport,
    isError: isErrorInnovationMetricsReport,
  } = useQuery(
    ["getInnovationMonitoringTargetMetricsByReportId", metricReportId],
    getInnovationMonitoringTargetMetricsByReportId,
    {
      enabled: !!metricReportId,
    }
  );

  const mutation = useMutation({
    mutationFn: newInnovationMonitoringUpdateMetric,
  });

  const formik = useFormik({
    initialValues: initialMetricValues,
    validationSchema: Yup.object().shape({
      actualByReportingPeriod: Yup.number().required("Required"),
      innovationMetricDescription: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const innovationMetrics = [];
        const metric = {
          id: metricReportId ?? new Guid().toString(),
          innovationId: initialMetricValues.innovationId,
          innovationMetricId: initialMetricValues.innovationMetricId,
          innovationActual: values.actualByReportingPeriod,
          innovationMetricDescription: values.innovationMetricDescription,
          reportingFrequencyId: initialMetricValues.reportingFrequencyId,
          reportingFrequency: "",
          implementationYearId: initialMetricValues.implementationYear,
          implementationYear: "",
          administrativeUnitId: initialMetricValues.administrativeUnitId,
          createDate: new Date(),
        };
        innovationMetrics.push(metric);
        await mutation.mutateAsync(innovationMetrics);

        toast("Successfully Updated Innovation Monitoring", {
          type: "success",
        });
        await queryClient.invalidateQueries([
          "getInnovationMonitoringTargetMetricsByInnovationId",
        ]);
        // handleMetricClick(values);
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

  useEffect(() => {
    if (!isLoadingInnovationMetricsReport && innovationMetricsReport) {
      formik.setValues({
        actualByReportingPeriod: innovationMetricsReport.data.innovationActual,
        innovationMetricDescription:
          innovationMetricsReport.data.innovationMetricDescription,
      });
    }
  }, [innovationMetricsReport, isLoadingInnovationMetricsReport]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={12}>
              <TextField
                name="actualByReportingPeriod"
                label="Actual"
                value={formik.values.actualByReportingPeriod}
                type="number"
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

            <Grid item md={12}>
              <TextField
                name="innovationMetricDescription"
                label="Description"
                value={formik.values.innovationMetricDescription}
                error={Boolean(
                  formik.touched.innovationMetricDescription &&
                    formik.errors.innovationMetricDescription
                )}
                fullWidth
                helperText={
                  formik.touched.innovationMetricDescription &&
                  formik.errors.innovationMetricDescription
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                multiline
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

const initialValues = {};
const InnovationUpdateForm = (props) => {
  const id = props.innovationId;
  const geoFocusId = props.projectLocationId;
  const reportingFrequencyId = props.reportingPeriod;
  const reportingYearId = props.year;

  const [metric, setMetric] = useState();
  const [metricReportId, setMetricReportId] = useState();
  const [innovationId, setInnovationId] = useState();
  const [locationId, setLocationId] = useState();
  const [reportPeriod, setReportPeriod] = useState();
  const [year, setYear] = useState();
  const [pageSize, setPageSize] = useState(5);
  const [openMetricDialog, setOpenMetricDialog] = useState();
  const [openRiskDialog, setOpenRiskDialog] = useState();
  const [innovationRisksList, setInnovationRisksList] = useState([]);
  const [innovationMetricsList, setInnovationMetricsList] = useState([]);

  const {
    data: innovationMetrics,
    isLoading: isLoadingInnovationMetrics,
    isError: isErrorInnovationMetrics,
  } = useQuery(
    ["getInnovationMonitoringTargetMetricsByInnovationId", id],
    getInnovationMonitoringTargetMetricsByInnovationId,
    {
      enabled: !!id,
    }
  );

  const {
    data: innovationMonitoring,
    isLoading: isLoadingInnovationMonitoring,
    isError: isErrorInnovationMonitoring,
  } = useQuery(
    [
      "getInnovationByMonitoringPeriod",
      id,
      geoFocusId,
      reportingFrequencyId,
      reportingYearId,
    ],
    getInnovationByMonitoringPeriod,
    { enabled: !!id }
  );

  const mutationRisk = useMutation({
    mutationFn: newInnovationMonitoringUpdateRisk,
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({}),
    onSubmit: async (values) => {
      try {
        const innovationRisks = [];
        for (const innovationRisk of innovationRisksList) {
          const risk = {
            innovationId: id,
            risk: innovationRisk.riskDescription,
            mitigation: innovationRisk.riskMitigation,
            reportingFrequencyId: innovationRisk.reportingFrequencyId,
            reportingFrequency: "",
            implementationYearId: innovationRisk.implementationYear,
            implementationYear: "",
            administrativeUnitId: innovationRisk.administrativeUnitId,
            createDate: new Date(),
          };
          innovationRisks.push(risk);
        }
        await mutationRisk.mutateAsync(innovationRisks);

        toast("Successfully Updated Innovation Monitoring", {
          type: "success",
        });
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
    function setCurrentFormValues() {
      if (
        !isLoadingInnovationMonitoring &&
        !isErrorInnovationMonitoring &&
        innovationMonitoring.data
      ) {
        const allRisks = [];
        for (const item of innovationMonitoring.data.innovationRisks) {
          const risk = {
            innovationId: item.innovationId,
            riskDescription: item.risk,
            riskMitigation: item.mitigation,
            reportingFrequencyId: item.reportingFrequencyId,
            reportingFrequency: "",
            implementationYearId: item.implementationYear,
            implementationYear: "",
            administrativeUnitId: item.administrativeUnitId,
            createDate: new Date(),
          };
          allRisks.push(risk);
        }
        setInnovationRisksList(allRisks);
      }
    }
    setCurrentFormValues();
  }, [innovationMonitoring, isLoadingInnovationMonitoring]);

  return (
    <form onSubmit={formik.handleSubmit}>
      {formik.isSubmitting ? (
        <Box display="flex" justifyContent="center" my={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container>
          <Grid container spacing={2} md={12} mb={2}>
            <Grid item md={12}>
              <Paper>
                <div style={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rowsPerPageOptions={[5, 10, 25]}
                    rows={
                      isLoadingInnovationMetrics || isErrorInnovationMetrics
                        ? []
                        : innovationMetrics
                        ? innovationMetrics.data
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
                        field: "innovationTarget1",
                        headerName: "Actuals",
                        editable: false,
                        flex: 1,
                        valueGetter: (params) =>
                          params.row.innovationMetricByReports
                            ?.innovationActual ?? "UNK",
                      },
                      {
                        field: "action",
                        headerName: "Update Actuals",
                        sortable: false,
                        flex: 1,
                        renderCell: (params) => (
                          <>
                            <Button
                              startIcon={<Edit2 />}
                              size="small"
                              onClick={() => {
                                setMetric(params.row);
                                setMetricReportId(
                                  params.row.innovationMetricByReports?.id
                                );
                                setInnovationId(id);
                                setLocationId(geoFocusId);
                                setReportPeriod(reportingFrequencyId);
                                setYear(reportingFrequencyId);
                                setOpenMetricDialog(true);
                              }}
                            ></Button>
                          </>
                        ),
                      },
                    ]}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    loading={isLoadingInnovationMetrics}
                    getRowHeight={() => "auto"}
                  />
                </div>
              </Paper>
            </Grid>

            <Grid container spacing={3} pt={10}>
              <Grid item md={12} my={2}>
                <Typography variant="h5" gutterBottom display="inline">
                  Risks Observed
                </Typography>
              </Grid>
              <Grid item md={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenRiskDialog(true)}
                >
                  <AddIcon /> Add Risk
                </Button>
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
                          <TableCell align="left">
                            {row.riskDescription}
                          </TableCell>
                          <TableCell align="left">
                            {row.riskMitigation}
                          </TableCell>
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
            </Grid>

            <Grid item mt={5} md={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                mt={3}
                ml={3}
              >
                <Check /> Save changes
              </Button>
            </Grid>
          </Grid>

          <Dialog
            fullWidth={true}
            maxWidth="md"
            open={openMetricDialog}
            onClose={() => setOpenMetricDialog(false)}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Enter Actuals</DialogTitle>
            <DialogContent>
              <MetricDetailsForm
                innovationId={innovationId}
                locationId={geoFocusId}
                reportPeriod={reportingFrequencyId}
                year={reportingYearId}
                handleMetricClick={handleAddMetric}
                metric={metric}
                metricReportId={metricReportId}
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
            <DialogTitle id="form-dialog-title">Add Risk</DialogTitle>
            <DialogContent>
              <RiskDetailsForm
                innovationId={innovationId}
                locationId={geoFocusId}
                reportPeriod={reportingFrequencyId}
                year={reportingYearId}
                handleRiskClick={handleAddRisk}
              />
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
  let {
    processLevelItemId,
    processLevelTypeId,
    innovationId,
    projectLocationId,
    reportingPeriod,
    year,
  } = useParams();

  return (
    <React.Fragment>
      <Helmet title="New Innovation Monitoring" />
      <Typography variant="h5" gutterBottom display="inline">
        Update
      </Typography>
      <Divider my={3} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item md={12}>
              <InnovationUpdateForm
                processLevelItemId={processLevelItemId}
                processLevelTypeId={processLevelTypeId}
                innovationId={innovationId}
                projectLocationId={projectLocationId}
                reportingPeriod={reportingPeriod}
                year={year}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default InnovationUpdate;
