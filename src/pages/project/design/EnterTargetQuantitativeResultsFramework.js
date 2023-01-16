import React, { useState } from "react";
import styled from "@emotion/styled";
import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider as MuiDivider,
  Grid,
  Link,
  MenuItem,
  Paper as MuiPaper,
  Stack,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { purple, grey } from "@mui/material/colors";
import { spacing } from "@mui/system";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Helmet } from "react-helmet-async";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLookupMasterItemsByName } from "../../../api/lookup";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { getProjectLocations } from "../../../api/location";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { getObjectiveByProcessLevelItemId } from "../../../api/project-objectives";
import {
  getResultChainByObjectiveId,
  getResultChainByOutcomeId,
  saveResultChain,
} from "../../../api/result-chain";
import { Guid } from "../../../utils/guid";
import AddIndicatorModal from "./AddIndicatorModal";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Paper = styled(MuiPaper)(spacing);

const theme = createTheme({
  palette: {
    secondary: {
      main: purple[500],
    },
    secondaryGray: {
      main: grey[500],
    },
  },
});

const initialValuesOutput = {
  output: "",
  outputCode: "",
  order: "",
};

const initialValuesOutcome = {
  outcome: "",
  code: "",
  order: "",
};

const initialValues = {
  implementationYear: "",
  location: "",
};

const AddOutputModal = ({ outcome, resultLevelOptionId, handleClick }) => {
  let { processLevelItemId, processLevelTypeId } = useParams();
  const queryClient = useQueryClient();

  const mutation = useMutation({ mutationFn: saveResultChain });
  const formik = useFormik({
    initialValues: initialValuesOutput,
    validationSchema: Yup.object().shape({
      output: Yup.string().required("Required"),
      outputCode: Yup.string().required("Required"),
      order: Yup.number().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const resultChain = {
          id: new Guid().toString(),
          code: values.outputCode,
          name: values.output,
          order: values.order,
          processLevelItemId: processLevelItemId,
          processLevelTypeId: processLevelTypeId,
          createDate: new Date(),
          resultLevelId: resultLevelOptionId,
          resultLevelNameId: outcome.id,
        };
        await mutation.mutateAsync(resultChain);
        await queryClient.invalidateQueries(["getResultChainByObjectiveId"]);
        await queryClient.invalidateQueries(["getResultChainByOutcomeId"]);
        handleClick();
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card mb={6}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Output
          </Typography>
          <Typography variant="body2" gutterBottom>
            {outcome.name}
          </Typography>
        </CardContent>
      </Card>
      <Card mb={12}>
        <CardContent>
          {formik.isSubmitting ? (
            <Box display="flex" justifyContent="center" my={6}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={6}>
                <Grid item md={4}>
                  <TextField
                    name="output"
                    label="Output"
                    required
                    value={formik.values.output}
                    error={Boolean(
                      formik.touched.output && formik.errors.output
                    )}
                    fullWidth
                    helperText={formik.touched.output && formik.errors.output}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
                <Grid item md={4}>
                  <TextField
                    name="outputCode"
                    label="Output Code"
                    required
                    value={formik.values.outputCode}
                    error={Boolean(
                      formik.touched.outputCode && formik.errors.outputCode
                    )}
                    fullWidth
                    helperText={
                      formik.touched.outputCode && formik.errors.outputCode
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
                <Grid item md={4}>
                  <TextField
                    name="order"
                    label="Order"
                    required
                    value={formik.values.order}
                    error={Boolean(formik.touched.order && formik.errors.order)}
                    fullWidth
                    helperText={formik.touched.order && formik.errors.order}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
              </Grid>
              <ThemeProvider theme={theme}>
                <Stack direction="row" spacing={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    mt={3}
                  >
                    Save
                  </Button>
                </Stack>
              </ThemeProvider>
            </>
          )}
        </CardContent>
      </Card>
    </form>
  );
};
const GetProjectOutputs = ({ outcomeId, resultLevelOptionId }) => {
  const {
    data: projectOutcomesOutputs,
    isLoading: isLoadingProjectOutcomesOutputs,
    isError: isErrorProjectOutcomesOutputs,
  } = useQuery(
    ["getResultChainByOutcomeId", outcomeId],
    getResultChainByOutcomeId,
    { enabled: !!outcomeId }
  );
  const result =
    !isLoadingProjectOutcomesOutputs &&
    !isErrorProjectOutcomesOutputs &&
    projectOutcomesOutputs &&
    projectOutcomesOutputs.data.length > 0
      ? projectOutcomesOutputs.data.filter(
          (obj) => obj.resultLevelId === resultLevelOptionId
        )
      : [];
  if (result.length === 0) {
    return `This Objective does not have Outputs, Please add output`;
  }
  return (
    <Grid container spacing={2}>
      <Grid item md={12}>
        {result.map((output) => (
          <Grid container spacing={2} key={output.id} sx={{ width: "100%" }}>
            <Grid item md={12}>
              <Paper elevation={24} square={true}>
                <Card mb={2}>
                  <CardContent>
                    <Typography variant="h4" gutterBottom display="inline">
                      {output.code}
                    </Typography>
                    &nbsp;&nbsp;
                    <Typography variant="h6" gutterBottom display="inline">
                      {output.name}
                    </Typography>
                    <Grid item md={12} sx={{ marginTop: 2, marginBottom: 2 }}>
                      <ThemeProvider theme={theme}>
                        <Stack direction="row" spacing={2}>
                          <Button variant="contained" color="secondaryGray">
                            <DeleteIcon />
                          </Button>
                        </Stack>
                      </ThemeProvider>
                    </Grid>
                    <Divider sx={{ backgroundColor: "#000000" }} />
                    <Grid item md={12} sx={{ marginTop: 2, marginBottom: 2 }}>
                      <ThemeProvider theme={theme}>
                        <Stack direction="row" spacing={2}>
                          <Button variant="contained" color="secondaryGray">
                            <AddIcon /> Indicator
                          </Button>
                        </Stack>
                      </ThemeProvider>
                    </Grid>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};
const GetProjectOutcomes = ({
  objectiveId,
  lookupItemId,
  resultLevelOptionId,
  processLevelItemId,
}) => {
  const [openOutputModal, setOpenOutputModal] = useState(false);
  const [openIndicatorModal, setOpenIndicatorModal] = useState(false);
  const [outcomeVal, setOutcomeVal] = useState();
  const {
    data: projectObjectivesOutcomes,
    isLoading: isLoadingProjectObjectivesOutcomes,
    isError: isErrorProjectObjectivesOutcomes,
  } = useQuery(
    ["getResultChainByObjectiveId", objectiveId],
    getResultChainByObjectiveId,
    { enabled: !!objectiveId }
  );

  const result =
    !isLoadingProjectObjectivesOutcomes &&
    !isErrorProjectObjectivesOutcomes &&
    projectObjectivesOutcomes &&
    projectObjectivesOutcomes.data.length > 0
      ? projectObjectivesOutcomes.data.filter(
          (obj) => obj.resultLevelId === lookupItemId
        )
      : [];
  if (result.length === 0) {
    return `This Objective does not have Outcome, Please add outcome`;
  }
  const handleClick = () => {
    setOpenOutputModal(false);
  };
  const handleClickIndicatorModal = () => {
    setOpenIndicatorModal(false);
  };
  return (
    <Grid container spacing={2}>
      <Grid item md={12}>
        {result.map((outcome) => (
          <Grid container spacing={2} key={outcome.id} sx={{ width: "100%" }}>
            <Grid item md={6}>
              <Paper elevation={24} square={true}>
                <Card mb={2} sx={{ backgroundColor: "gray" }}>
                  <CardContent>
                    <Typography variant="h4" gutterBottom display="inline">
                      {outcome.code}
                    </Typography>
                    &nbsp;&nbsp;
                    <Typography variant="h6" gutterBottom display="inline">
                      {outcome.name}
                    </Typography>
                    <Grid item md={12} sx={{ marginTop: 2, marginBottom: 2 }}>
                      <ThemeProvider theme={theme}>
                        <Stack direction="row" spacing={2}>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                              setOpenOutputModal(true);
                              setOutcomeVal(outcome);
                            }}
                          >
                            <AddIcon /> Output
                          </Button>
                          <Button variant="contained" color="secondaryGray">
                            <DeleteIcon />
                          </Button>
                        </Stack>
                      </ThemeProvider>
                    </Grid>
                    <Divider sx={{ backgroundColor: "#000000" }} />
                    <Grid item md={12} sx={{ marginTop: 2, marginBottom: 2 }}>
                      <ThemeProvider theme={theme}>
                        <Stack direction="row" spacing={2}>
                          <Button
                            variant="contained"
                            color="secondaryGray"
                            onClick={() => {
                              setOpenIndicatorModal(true);
                              setOutcomeVal(outcome);
                            }}
                          >
                            <AddIcon /> Indicator
                          </Button>
                        </Stack>
                      </ThemeProvider>
                    </Grid>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>
            <Grid item md={6}>
              <Paper elevation={24} square={true}>
                <Card mb={2} sx={{ backgroundColor: "gray" }}>
                  <CardHeader title={`Output(s)`} />
                  <Divider />
                  <CardContent>
                    <GetProjectOutputs
                      outcomeId={outcome.id}
                      resultLevelOptionId={resultLevelOptionId}
                    />
                  </CardContent>
                </Card>
              </Paper>
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={openOutputModal}
        onClose={() => setOpenOutputModal(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <AddOutputModal
            outcome={outcomeVal}
            resultLevelOptionId={resultLevelOptionId}
            handleClick={handleClick}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => setOpenOutputModal(false)}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={openIndicatorModal}
        onClose={() => setOpenIndicatorModal(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <AddIndicatorModal
            processLevelItemId={processLevelItemId}
            handleClick={handleClickIndicatorModal}
            outcome={outcomeVal}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => setOpenIndicatorModal(false)}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};
const AddOutcomeModal = ({ lookupItemId, projectObjective, handleClick }) => {
  let { processLevelItemId, processLevelTypeId } = useParams();
  const queryClient = useQueryClient();

  const mutation = useMutation({ mutationFn: saveResultChain });
  const formik = useFormik({
    initialValues: initialValuesOutcome,
    validationSchema: Yup.object().shape({
      outcome: Yup.string().required("Required"),
      code: Yup.string().required("Required"),
      order: Yup.number().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const resultChain = {
          id: new Guid().toString(),
          code: values.code,
          name: values.outcome,
          order: values.order,
          processLevelItemId: processLevelItemId,
          processLevelTypeId: processLevelTypeId,
          createDate: new Date(),
          resultLevelId: lookupItemId,
          resultLevelNameId: projectObjective.id,
        };
        await mutation.mutateAsync(resultChain);
        await queryClient.invalidateQueries(["getResultChainByObjectiveId"]);
        await queryClient.invalidateQueries(["getResultChainByOutcomeId"]);
        handleClick();
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card mb={6}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Outcome
          </Typography>
          <Typography variant="body2" gutterBottom>
            {projectObjective.objective}
          </Typography>
        </CardContent>
      </Card>
      <Card mb={12}>
        <CardContent>
          {formik.isSubmitting ? (
            <Box display="flex" justifyContent="center" my={6}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={6}>
                <Grid item md={4}>
                  <TextField
                    name="outcome"
                    label="Outcome"
                    required
                    value={formik.values.outcome}
                    error={Boolean(
                      formik.touched.outcome && formik.errors.outcome
                    )}
                    fullWidth
                    helperText={formik.touched.outcome && formik.errors.outcome}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
                <Grid item md={4}>
                  <TextField
                    name="code"
                    label="Code"
                    required
                    value={formik.values.code}
                    error={Boolean(formik.touched.code && formik.errors.code)}
                    fullWidth
                    helperText={formik.touched.code && formik.errors.code}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
                <Grid item md={4}>
                  <TextField
                    name="order"
                    label="Order"
                    required
                    value={formik.values.order}
                    error={Boolean(formik.touched.order && formik.errors.order)}
                    fullWidth
                    helperText={formik.touched.order && formik.errors.order}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
              </Grid>
              <ThemeProvider theme={theme}>
                <Stack direction="row" spacing={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    mt={3}
                  >
                    Save
                  </Button>
                </Stack>
              </ThemeProvider>
            </>
          )}
        </CardContent>
      </Card>
    </form>
  );
};
const EnterTargetByLocationForm = () => {
  let { processLevelItemId, processLevelTypeId } = useParams();
  const navigate = useNavigate();
  const {
    data: projectGeographicalFocus,
    isLoading: isLoadingGeoFocus,
    isError: isErrorGeoFocus,
  } = useQuery(
    ["getProjectLocations", processLevelItemId],
    getProjectLocations,
    {
      refetchOnWindowFocus: false,
      enabled: !!processLevelItemId,
    }
  );
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
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      implementationYear: Yup.string().required("Required"),
      location: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        navigate(
          `/project/project-indicator-targets/${processLevelItemId}/${processLevelTypeId}/${values.location}/${values.implementationYear}`
        );
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card mb={12}>
        <CardContent>
          {formik.isSubmitting ? (
            <Box display="flex" justifyContent="center" my={6}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={6}>
                <Grid item md={6}>
                  <TextField
                    name="implementationYear"
                    label="Implementation Year"
                    select
                    required
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
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Implementation Year
                    </MenuItem>
                    {!isLoading && !isError
                      ? implementationYears.data.map((option) => (
                          <MenuItem
                            key={option.lookupItemId}
                            value={option.lookupItemId}
                          >
                            {option.lookupItemName}
                          </MenuItem>
                        ))
                      : []}
                  </TextField>
                </Grid>
                <Grid item md={6}>
                  <TextField
                    name="location"
                    label="Location"
                    select
                    required
                    value={formik.values.location}
                    error={Boolean(
                      formik.touched.location && formik.errors.location
                    )}
                    fullWidth
                    helperText={
                      formik.touched.location && formik.errors.location
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Location
                    </MenuItem>
                    {!isLoadingGeoFocus && !isErrorGeoFocus
                      ? projectGeographicalFocus.data.map((option) => (
                          <MenuItem
                            key={option.id}
                            value={option.administrativeUnitId}
                          >
                            {option.administrativeUnitName}
                          </MenuItem>
                        ))
                      : []}
                  </TextField>
                </Grid>
              </Grid>
              <ThemeProvider theme={theme}>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  mt={3}
                >
                  Proceed to set target
                </Button>
              </ThemeProvider>
            </>
          )}
        </CardContent>
      </Card>
    </form>
  );
};
const EnterTargetQuantitativeResultsFrameworkForm = ({
  processLevelItemId,
}) => {
  const [open, setOpen] = useState(false);
  const [openOutcomeModal, setOpenOutcomeModal] = useState(false);
  const [projectObjectiveVal, setProjectObjective] = useState(false);
  const {
    data: projectObjectives,
    isLoading: isLoadingProjectObjectives,
    isError: isErrorProjectObjectives,
  } = useQuery(
    ["getObjectiveByProcessLevelItemId", processLevelItemId],
    getObjectiveByProcessLevelItemId,
    { enabled: !!processLevelItemId }
  );
  const {
    data: dataResultLevel,
    isLoading: isLoadingResultLevel,
    isError: isErrorResultLevel,
  } = useQuery(["ResultLevel", "ResultLevel"], getLookupMasterItemsByName);
  const resultLevelOption =
    !isLoadingResultLevel &&
    !isErrorResultLevel &&
    dataResultLevel &&
    dataResultLevel.data.length > 0 &&
    dataResultLevel.data.find((obj) => obj.lookupItemName === "Outcome");
  const resultLevelOptionOutput =
    !isLoadingResultLevel &&
    !isErrorResultLevel &&
    dataResultLevel &&
    dataResultLevel.data.length > 0 &&
    dataResultLevel.data.find((obj) => obj.lookupItemName === "Output");
  const { lookupItemId } = resultLevelOption ? resultLevelOption : {};
  const { lookupItemId: resultLevelOptionId } = resultLevelOptionOutput
    ? resultLevelOptionOutput
    : {};

  const handleClick = () => {
    setOpenOutcomeModal(false);
  };

  return (
    <Grid container spacing={12}>
      <Grid item md={12}>
        <ThemeProvider theme={theme}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpen(true)}
          >
            <AddIcon /> Enter Target By Location
          </Button>
        </ThemeProvider>
        <Dialog
          fullWidth={true}
          maxWidth="md"
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Targets</DialogTitle>
          <DialogContent>
            <DialogContentText>Enter Target By Location</DialogContentText>
            <EnterTargetByLocationForm />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
      <Grid item md={12}>
        <Grid container spacing={2}>
          {!isLoadingProjectObjectives &&
            !isErrorProjectObjectives &&
            projectObjectives.data.map((projectObjective) => (
              <Grid item md={12} key={projectObjective.id}>
                <ThemeProvider theme={theme}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" gutterBottom display="inline">
                        {projectObjective.objective}
                      </Typography>
                    </CardContent>
                  </Card>
                </ThemeProvider>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={4}>
                    <Card>
                      <CardHeader title={"Objective(s)"}></CardHeader>
                      <Divider />
                      <CardContent>
                        <Grid container spacing={6}>
                          <Grid item>{projectObjective.objective}</Grid>
                          <Grid item>
                            <ThemeProvider theme={theme}>
                              <Stack direction="row" spacing={2}>
                                <Button
                                  variant="contained"
                                  color="secondaryGray"
                                  onClick={() => {
                                    setOpenOutcomeModal(true);
                                    setProjectObjective(projectObjective);
                                  }}
                                >
                                  <AddIcon /> Outcome
                                </Button>
                                <Button
                                  variant="contained"
                                  color="secondaryGray"
                                >
                                  <DeleteIcon />
                                </Button>
                              </Stack>
                            </ThemeProvider>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item md={8}>
                    <Card>
                      <CardHeader title={"Outcome(s)"}></CardHeader>
                      <Divider />
                      <CardContent>
                        <GetProjectOutcomes
                          objectiveId={projectObjective.id}
                          lookupItemId={lookupItemId}
                          resultLevelOptionId={resultLevelOptionId}
                          processLevelItemId={processLevelItemId}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            ))}
        </Grid>
      </Grid>
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={openOutcomeModal}
        onClose={() => setOpenOutcomeModal(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <AddOutcomeModal
            lookupItemId={lookupItemId}
            projectObjective={projectObjectiveVal}
            handleClick={handleClick}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => setOpenOutcomeModal(false)}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};
const EnterTargetQuantitativeResultsFramework = () => {
  let { processLevelItemId } = useParams();
  return (
    <React.Fragment>
      <Helmet title="Results Framework" />
      <Typography variant="h3" gutterBottom display="inline">
        Results Framework
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link
          component={NavLink}
          to={`/project/design-project/${processLevelItemId}`}
        >
          Project Design
        </Link>
        <Typography>Project Quantitative Result Framework</Typography>
      </Breadcrumbs>
      <Divider my={6} />
      <EnterTargetQuantitativeResultsFrameworkForm
        processLevelItemId={processLevelItemId}
      />
    </React.Fragment>
  );
};
export default EnterTargetQuantitativeResultsFramework;
