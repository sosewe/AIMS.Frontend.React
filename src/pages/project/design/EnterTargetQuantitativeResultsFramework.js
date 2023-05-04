import React, { useEffect, useState } from "react";
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
import { NavLink, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLookupMasterItemsByName } from "../../../api/lookup";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { getProjectLocations } from "../../../api/location";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  deleteProjectObjective,
  getObjectiveByProcessLevelItemId,
} from "../../../api/project-objectives";
import {
  deleteResultChain,
  getResultChainByObjectiveId,
  getResultChainByOutcomeId,
  saveResultChain,
} from "../../../api/result-chain";
import { Guid } from "../../../utils/guid";
import AddIndicatorModal from "./AddIndicatorModal";
import ResultChainIndicators from "./ResultChainIndicators";

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
};

const initialValuesOutcome = {
  outcome: "",
};

const initialValues = {
  implementationYear: "",
  location: "",
  operation: "",
};

const AddOutputModal = ({
  outcome,
  resultLevelOptionId,
  handleClick,
  processLevelItemId,
  processLevelTypeId,
  output,
  outputId,
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({ mutationFn: saveResultChain });
  const formik = useFormik({
    initialValues: initialValuesOutput,
    validationSchema: Yup.object().shape({
      output: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const resultChain = {
          id: outputId ? outputId : new Guid().toString(),
          // code: values.outputCode,
          name: values.output,
          // order: values.order,
          processLevelItemId: processLevelItemId,
          processLevelTypeId: processLevelTypeId,
          createDate: new Date(),
          resultLevelId: resultLevelOptionId,
          resultLevelNameId: outcome.id,
          type: "Output",
          prev: outcome.code,
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

  useEffect(() => {
    function setCurrentFormValues() {
      if (output) {
        formik.setValues({
          output: output.name,
        });
      }
    }
    setCurrentFormValues();
  }, [output]);

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
                <Grid item md={12}>
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
                    multiline
                    rows={3}
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
const GetProjectOutputs = ({
  outcomeId,
  resultLevelOptionId,
  processLevelItemId,
  processLevelTypeId,
  outcome,
}) => {
  const [openOutputModal, setOpenOutputModal] = useState(false);
  const [openDeleteResultChain, setOpenDeleteResultChain] = useState(false);
  const [openIndicatorModal, setOpenIndicatorModal] = useState(false);
  const [outcomeVal, setOutcomeVal] = useState();
  const [outputId, setOutputId] = useState();
  const [output, setOutput] = useState();
  const queryClient = useQueryClient();
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
  const { refetch } = useQuery(
    ["deleteResultChain", outputId],
    deleteResultChain,
    { enabled: false }
  );
  if (result.length === 0) {
    return `This Outcome does not have Outputs, Please add output`;
  }
  const handleDeleteResultChain = async () => {
    await refetch();
    setOpenDeleteResultChain(false);
    await queryClient.invalidateQueries(["getResultChainByOutcomeId"]);
  };
  const handleClickIndicatorModal = async () => {
    setOpenIndicatorModal(false);
    await queryClient.invalidateQueries([
      "getResultChainIndicatorsByResultChainId",
    ]);
  };
  const handleClick = () => {
    setOpenOutputModal(false);
  };
  function handleCloseDeleteResult() {
    setOpenDeleteResultChain(false);
  }
  return (
    <Grid container spacing={0}>
      <Grid item md={12}>
        {result.map((output) => (
          <Grid
            container
            spacing={0}
            key={output.id}
            sx={{ width: "100%", border: 1 }}
          >
            <Grid item md={12}>
              <Paper elevation={24} square={true}>
                <Card mb={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom display="inline">
                      {output.code}
                    </Typography>
                    &nbsp;&nbsp;
                    <Typography variant="body2" gutterBottom display="inline">
                      {output.name}
                    </Typography>
                    <Grid item md={12} sx={{ marginTop: 2, marginBottom: 2 }}>
                      <ThemeProvider theme={theme}>
                        <Stack direction="row" spacing={2}>
                          <Button
                            variant="contained"
                            color="secondaryGray"
                            onClick={() => {
                              setOutputId(output.id);
                              setOutput(output);
                              setOpenOutputModal(true);
                            }}
                          >
                            <EditIcon />
                          </Button>
                          <Button
                            variant="contained"
                            color="secondaryGray"
                            onClick={() => {
                              setOutputId(output.id);
                              setOpenDeleteResultChain(true);
                            }}
                          >
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
                              setOutcomeVal(output);
                            }}
                          >
                            <AddIcon /> Indicator
                          </Button>
                        </Stack>
                      </ThemeProvider>
                    </Grid>
                    <Divider sx={{ backgroundColor: "#000000" }} />
                    <Grid item md={12}>
                      <ResultChainIndicators
                        outcomeId={output.id}
                        processLevelItemId={processLevelItemId}
                        processLevelTypeId={processLevelTypeId}
                      />
                    </Grid>
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
        open={openDeleteResultChain}
        onClose={() => setOpenDeleteResultChain(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>Delete Output</DialogTitle>
        <Divider />
        <DialogContent>Are you sure you want to delete Output?</DialogContent>
        <DialogActions>
          <Button onClick={() => handleDeleteResultChain()} color="primary">
            Yes
          </Button>
          <Button
            onClick={() => handleCloseDeleteResult()}
            color="error"
            autoFocus
          >
            No
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
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={openOutputModal}
        onClose={() => setOpenOutputModal(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <AddOutputModal
            outcome={outcome}
            resultLevelOptionId={resultLevelOptionId}
            handleClick={handleClick}
            processLevelItemId={processLevelItemId}
            processLevelTypeId={processLevelTypeId}
            output={output}
            outputId={outputId}
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
    </Grid>
  );
};
const GetProjectOutcomes = ({
  objectiveId,
  lookupItemId,
  resultLevelOptionId,
  processLevelItemId,
  processLevelTypeId,
  projectObjective,
  index,
}) => {
  const queryClient = useQueryClient();
  const [openOutputModal, setOpenOutputModal] = useState(false);
  const [openIndicatorModal, setOpenIndicatorModal] = useState(false);
  const [openDeleteResultChain, setDeleteResultChain] = useState(false);
  const [openOutcomeModal, setOpenOutcomeModal] = useState(false);
  const [outcomeId, setOutcomeId] = useState();
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
  const { refetch } = useQuery(
    ["deleteResultChain", outcomeId],
    deleteResultChain,
    { enabled: false }
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
    setOpenOutcomeModal(false);
  };
  const handleClickIndicatorModal = async () => {
    setOpenIndicatorModal(false);
    await queryClient.invalidateQueries([
      "getResultChainIndicatorsByResultChainId",
    ]);
  };
  const handleDeleteResultChain = () => {
    setDeleteResultChain(false);
  };
  const onClickDeleteResultChain = async () => {
    await refetch();
    setDeleteResultChain(false);
    await queryClient.invalidateQueries(["getResultChainByObjectiveId"]);
  };
  return (
    <Grid container spacing={2}>
      <Grid item md={12}>
        {result.map((outcome) => (
          <Grid container spacing={2} key={outcome.id} sx={{ width: "100%" }}>
            <Grid item md={12}>
              <Paper elevation={24} square={true}>
                <Card mb={2} sx={{ borderStyle: "groove" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom display="inline">
                      {outcome.code}
                    </Typography>
                    &nbsp;&nbsp;
                    <Typography variant="body2" gutterBottom display="inline">
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
                          <Button
                            variant="contained"
                            color="secondaryGray"
                            onClick={() => {
                              setOutcomeId(outcome.id);
                              setOutcomeVal(outcome);
                              setOpenOutcomeModal(true);
                            }}
                          >
                            <EditIcon />
                          </Button>
                          <Button
                            variant="contained"
                            color="secondaryGray"
                            onClick={() => {
                              setOutcomeId(outcome.id);
                              setDeleteResultChain(true);
                            }}
                          >
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
                    <Divider sx={{ backgroundColor: "#000000" }} />
                    <Grid item md={12}>
                      <ResultChainIndicators
                        outcomeId={outcome.id}
                        processLevelItemId={processLevelItemId}
                        processLevelTypeId={processLevelTypeId}
                      />
                    </Grid>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>
            <Grid item md={12}>
              <Paper elevation={24} square={true}>
                <Card mb={2} sx={{ borderStyle: "groove" }}>
                  <CardHeader title={`Output(s)`} />
                  <Divider />
                  <CardContent>
                    <GetProjectOutputs
                      outcomeId={outcome.id}
                      resultLevelOptionId={resultLevelOptionId}
                      processLevelItemId={processLevelItemId}
                      processLevelTypeId={processLevelTypeId}
                      outcome={outcome}
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
            processLevelItemId={processLevelItemId}
            processLevelTypeId={processLevelTypeId}
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
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={openDeleteResultChain}
        onClose={() => setDeleteResultChain(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>Delete Outcome</DialogTitle>
        <Divider />
        <DialogContent>Are you sure you want to delete Outcome?</DialogContent>
        <DialogActions>
          <Button onClick={() => onClickDeleteResultChain()} color="primary">
            Yes
          </Button>
          <Button
            onClick={() => handleDeleteResultChain()}
            color="error"
            autoFocus
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
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
            projectObjective={projectObjective}
            projectObjectiveIndex={index}
            processLevelItemId={processLevelItemId}
            processLevelTypeId={processLevelTypeId}
            handleClick={handleClick}
            outcomeId={outcomeId}
            outcomeVal={outcomeVal}
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
const AddOutcomeModal = ({
  lookupItemId,
  projectObjective,
  projectObjectiveIndex,
  processLevelItemId,
  processLevelTypeId,
  handleClick,
  outcomeId,
  outcomeVal,
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({ mutationFn: saveResultChain });
  const formik = useFormik({
    initialValues: initialValuesOutcome,
    validationSchema: Yup.object().shape({
      outcome: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const resultChain = {
          id: outcomeId ? outcomeId : new Guid().toString(),
          name: values.outcome,
          processLevelItemId: processLevelItemId,
          processLevelTypeId: processLevelTypeId,
          createDate: new Date(),
          resultLevelId: lookupItemId,
          resultLevelNameId: projectObjective.id,
          type: "Outcome",
          prev: projectObjectiveIndex + 1,
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

  useEffect(() => {
    function setCurrentFormValues() {
      if (outcomeVal) {
        formik.setValues({
          outcome: outcomeVal.name,
        });
      }
    }
    setCurrentFormValues();
  }, [outcomeVal]);

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
                <Grid item md={12}>
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
                    rows={3}
                    multiline
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
const EnterTargetByLocationForm = ({
  processLevelItemId,
  processLevelTypeId,
}) => {
  // let { processLevelItemId, processLevelTypeId } = useParams();
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
      operation: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        if (values.operation === "edit") {
          navigate(
            `/project/project-indicator-targets/${processLevelItemId}/${processLevelTypeId}/${values.location}/${values.implementationYear}`
          );
        } else if (values.operation === "view") {
          navigate(
            `/project/project-indicator-targets-view/${processLevelItemId}/${processLevelTypeId}/${values.location}/${values.implementationYear}`
          );
        }
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
                <Grid item md={4}>
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
                <Grid item md={4}>
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
                          <MenuItem key={option.id} value={option.id}>
                            {option.administrativeUnitName}
                          </MenuItem>
                        ))
                      : []}
                  </TextField>
                </Grid>
                <Grid item md={4}>
                  <TextField
                    name="operation"
                    label="Operation"
                    select
                    required
                    value={formik.values.operation}
                    error={Boolean(
                      formik.touched.operation && formik.errors.operation
                    )}
                    fullWidth
                    helperText={
                      formik.touched.operation && formik.errors.operation
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Location
                    </MenuItem>
                    <MenuItem key="edit" value="edit">
                      Add/Edit
                    </MenuItem>
                    <MenuItem key="view" value="view">
                      View
                    </MenuItem>
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
  processLevelTypeId,
}) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [openOutcomeModal, setOpenOutcomeModal] = useState(false);
  const [projectObjectiveIndex, setProjectObjectiveIndex] = useState(false);
  const [projectObjectiveVal, setProjectObjective] = useState(false);
  const [openDeleteObjective, setOpenDeleteObjective] = useState(false);
  const [projectObjectiveId, setProjectObjectiveId] = useState();
  const { refetch } = useQuery(
    ["deleteProjectObjective", projectObjectiveId],
    deleteProjectObjective,
    { enabled: false }
  );
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
  const onClickDeleteProjectObjective = async () => {
    await refetch();
    setOpenDeleteObjective(false);
    await queryClient.invalidateQueries(["getObjectiveByProcessLevelItemId"]);
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
            <EnterTargetByLocationForm
              processLevelItemId={processLevelItemId}
              processLevelTypeId={processLevelTypeId}
            />
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
            projectObjectives.data.map((projectObjective, index) => (
              <React.Fragment key={Math.random().toString(36)}>
                <Grid
                  item
                  md={12}
                  key={projectObjective.id}
                  sx={{ border: 1, marginBottom: 10 }}
                >
                  <ThemeProvider theme={theme}>
                    <Card sx={{ borderStyle: "groove" }}>
                      <CardHeader title={"Objective(s)"}></CardHeader>
                      <CardContent>
                        <Typography
                          variant="body2"
                          gutterBottom
                          display="inline"
                        >
                          {projectObjective.objective}
                        </Typography>
                        <Grid container spacing={6}>
                          <Grid item>
                            <ThemeProvider theme={theme}>
                              <Stack direction="row" spacing={2}>
                                <Button
                                  variant="contained"
                                  color="secondaryGray"
                                  onClick={() => {
                                    setOpenOutcomeModal(true);
                                    setProjectObjectiveIndex(index);
                                    setProjectObjective(projectObjective);
                                  }}
                                >
                                  <AddIcon /> Outcome
                                </Button>
                                <Button
                                  variant="contained"
                                  color="secondaryGray"
                                  onClick={() => {
                                    setOpenDeleteObjective(true);
                                    setProjectObjectiveId(projectObjective.id);
                                  }}
                                >
                                  <DeleteIcon />
                                </Button>
                              </Stack>
                            </ThemeProvider>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </ThemeProvider>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={12}>
                      <Card>
                        <CardHeader title={"Outcome(s)"}></CardHeader>
                        <Divider />
                        <CardContent>
                          <GetProjectOutcomes
                            objectiveId={projectObjective.id}
                            lookupItemId={lookupItemId}
                            resultLevelOptionId={resultLevelOptionId}
                            processLevelItemId={processLevelItemId}
                            processLevelTypeId={processLevelTypeId}
                            projectObjective={projectObjective}
                            index={index}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
              </React.Fragment>
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
            projectObjectiveIndex={projectObjectiveIndex}
            processLevelItemId={processLevelItemId}
            processLevelTypeId={processLevelTypeId}
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
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={openDeleteObjective}
        onClose={() => setOpenDeleteObjective(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>Delete Project Objective</DialogTitle>
        <Divider />
        <DialogContent>
          Are you sure you want to delete projective objective?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => onClickDeleteProjectObjective()}
            color="primary"
          >
            Yes
          </Button>
          <Button
            onClick={() => setOpenDeleteObjective(false)}
            color="error"
            autoFocus
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};
const EnterTargetQuantitativeResultsFramework = ({
  processLevelItemId,
  processLevelTypeId,
}) => {
  return (
    <React.Fragment>
      <Helmet title="Results Framework" />
      <Typography variant="h3" gutterBottom display="inline">
        Results Framework
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link
          component={NavLink}
          to={`/project/design-project/${processLevelItemId}/${processLevelTypeId}`}
        >
          Project Design
        </Link>
        <Typography>Project Quantitative Result Framework</Typography>
      </Breadcrumbs>
      <Divider my={6} />
      <EnterTargetQuantitativeResultsFrameworkForm
        processLevelItemId={processLevelItemId}
        processLevelTypeId={processLevelTypeId}
      />
    </React.Fragment>
  );
};
export default EnterTargetQuantitativeResultsFramework;
