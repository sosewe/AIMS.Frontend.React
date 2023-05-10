import React, { useEffect, useState } from "react";
import {
  Autocomplete as MuiAutocomplete,
  Box,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  MenuItem,
  Paper as MuiPaper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField as MuiTextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getInnovationById, getInnovations } from "../../../../api/innovation";
import {
  getAMREFStaffList,
  getLookupMasterItemsByName,
} from "../../../../api/lookup";
import { getAmrefEntities } from "../../../../api/amref-entity";
import { getQualitativeCountryByTypeItemId } from "../../../../api/qualitative-country";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import InnovationChallengesForm from "./InnovationChallengesForm";
import { Guid } from "../../../../utils/guid";
import { newInnovationProgress } from "../../../../api/innovation-progress";
import { newInnovationChallenge } from "../../../../api/innovation-challenge";
import { useParams } from "react-router-dom";

const theme = createTheme({
  palette: {
    neutral: {
      main: "#64748B",
      contrastText: "#fff",
    },
  },
});

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);
const Autocomplete = styled(MuiAutocomplete)(spacing);
const TextField = styled(MuiTextField)(spacing);

const initialValues = {
  name: "",
  staffNameId: "",
  countryId: [],
  duration_from: "",
  duration_to: "",
  currentStageId: "",
  updateProgress: "",
  bragStatusId: "",
  plaDeviations: "",
};

const InnovationMonitoringForm = () => {
  let { id } = useParams();
  const [openChallengesModal, setOpenChallengesModal] = useState(false);
  const [innovationId, setInnovationId] = useState();
  const [innovation, setInnovation] = useState();
  const [challengesArray, setChallengesArray] = useState([]);
  const {
    isLoading: isLoadingStaffList,
    isError: isErrorStaffList,
    data: staffListData,
  } = useQuery(["staffList"], getAMREFStaffList, {
    refetchOnWindowFocus: false,
    retry: 0,
  });
  const {
    isLoading: isLoadingAmrefEntities,
    data: amrefEntities,
    isError: isErrorAmrefEntities,
  } = useQuery(["amrefEntities"], getAmrefEntities, {
    refetchOnWindowFocus: false,
  });
  const {
    data: InnovationsData,
    isLoading: isLoadingInnovations,
    isError: isErrorInnovations,
  } = useQuery(["getInnovations"], getInnovations, {
    refetchOnWindowFocus: false,
  });
  const {
    data: InnovationData,
    isLoading: isLoadingInnovationData,
    isError: isErrorInnovationData,
  } = useQuery(["getInnovationById", innovationId], getInnovationById, {
    enabled: !!innovationId,
  });
  const {
    data: QualitativeCountryData,
    isLoading: isLoadingQualitativeCountry,
    isError: isErrorQualitativeCountry,
  } = useQuery(
    ["getQualitativeCountryByTypeItemId", innovationId],
    getQualitativeCountryByTypeItemId,
    { enabled: !!innovationId }
  );
  const {
    isLoading: isLoadingInnovationStageData,
    isError: isErrorInnovationStageData,
    data: InnovationStageData,
  } = useQuery(
    ["innovationStage", "InnovationStage"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );
  const {
    isLoading: isLoadingBRAGStatusData,
    isError: isErrorBRAGStatusData,
    data: BRAGStatusData,
  } = useQuery(["bragStatus", "BRAGStatus"], getLookupMasterItemsByName, {
    refetchOnWindowFocus: false,
  });

  const onInnovationNameChange = (event, val) => {
    setInnovationId(val.id);
    setInnovation(val);
  };

  const handleClick = (values) => {
    const guid = new Guid();
    setChallengesArray((current) => [
      ...current,
      { id: guid.toString(), challenge: values.challenge },
    ]);
  };

  function removeChallenge(index) {
    const newItems = [...challengesArray];
    newItems.splice(index, 1);
    setChallengesArray(newItems);
  }

  const mutation = useMutation({ mutationFn: newInnovationProgress });
  const mutationInnovationChallenge = useMutation({
    mutationFn: newInnovationChallenge,
  });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      name: Yup.object().required("Required"),
      staffNameId: Yup.object().required("Required"),
      countryId: Yup.array().required("Required"),
      duration_from: Yup.date().required("Required"),
      duration_to: Yup.date().required("Required"),
      currentStageId: Yup.string().required("Required"),
      updateProgress: Yup.string().required("Required"),
      bragStatusId: Yup.string().required("Required"),
      plaDeviations: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        console.log(values);
        const innovationProgress = {
          id: new Guid().toString(),
          createDate: new Date(),
          innovationId: values.name.id,
          currentStageId: values.currentStageId,
          updateProgress: values.updateProgress,
          bragStatusId: values.bragStatusId,
          plaDeviations: values.plaDeviations,
        };
        const innovationProgressResult = await mutation.mutateAsync(
          innovationProgress
        );
        for (const challengeVal of challengesArray) {
          const innovationChallenges = {
            id: new Guid().toString(),
            createDate: new Date(),
            innovationProgressId: innovationProgressResult.data.id,
            challengesExperienced: challengeVal.challenge,
            challengeResolution: "",
          };
          await mutationInnovationChallenge.mutateAsync(innovationChallenges);
        }
        toast("Successfully Innovation Monitoring", {
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

  useEffect(() => {
    function setCurrentFormValues() {
      setInnovationId(id);
      if (
        !isLoadingInnovationData &&
        !isErrorInnovationData &&
        !isErrorStaffList &&
        !isLoadingStaffList &&
        !isLoadingQualitativeCountry &&
        !isErrorQualitativeCountry
      ) {
        let staff;
        let countries = [];
        if (!isErrorStaffList && !isLoadingStaffList) {
          staff = staffListData.data.find(
            (obj) => obj.id === InnovationData.data.staffNameId
          );
        }
        for (const qualitativeCountryFind of QualitativeCountryData.data) {
          const result = amrefEntities.data.find(
            (obj) => obj.id === qualitativeCountryFind.organizationUnitId
          );
          if (result) {
            countries.push(result);
          }
        }
        formik.setValues({
          name: InnovationData.data,
          staffNameId: staff ? staff : "",
          countryId: countries && countries.length > 0 ? countries : [],
          duration_from: "",
          duration_to: "",
          currentStageId: "",
          updateProgress: "",
          bragStatusId: "",
          plaDeviations: "",
        });
      }
    }
    setCurrentFormValues();
  }, [
    isLoadingInnovationData,
    isErrorInnovationData,
    InnovationData,
    isErrorStaffList,
    isLoadingStaffList,
    staffListData,
    innovationId,
    isErrorQualitativeCountry,
    isLoadingQualitativeCountry,
    QualitativeCountryData,
    innovation,
    amrefEntities,
    id,
  ]);

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
              <Grid container item spacing={2}>
                <Grid item md={6}>
                  <Autocomplete
                    id="name"
                    options={
                      !isLoadingInnovations && !isErrorInnovations
                        ? InnovationsData.data
                        : []
                    }
                    getOptionLabel={(innovation) => {
                      if (!innovation) {
                        return ""; // Return an empty string for null or undefined values
                      }
                      return `${innovation.title}`;
                    }}
                    renderOption={(props, option) => {
                      return (
                        <li {...props} key={option.id}>
                          {option?.title}
                        </li>
                      );
                    }}
                    onChange={(e, val) => {
                      formik.setFieldValue("name", val);
                      onInnovationNameChange(e, val);
                    }}
                    value={formik.values.name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={Boolean(
                          formik.touched.name && formik.errors.name
                        )}
                        fullWidth
                        helperText={formik.touched.name && formik.errors.name}
                        label="Name"
                        name="name"
                        variant="outlined"
                        my={2}
                      />
                    )}
                  />
                </Grid>
                <Grid item md={6}>
                  <Autocomplete
                    id="staffNameId"
                    options={
                      !isLoadingStaffList && !isErrorStaffList
                        ? staffListData.data
                        : []
                    }
                    getOptionLabel={(staff) => {
                      if (!staff) {
                        return "";
                      }
                      return `${staff?.firstName} ${staff?.lastName}`;
                    }}
                    renderOption={(props, option) => {
                      return (
                        <li {...props} key={option.id}>
                          {option.firstName} {option.lastName}
                        </li>
                      );
                    }}
                    onChange={(_, val) =>
                      formik.setFieldValue("staffNameId", val)
                    }
                    value={formik.values.staffNameId}
                    disabled={true}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={Boolean(
                          formik.touched.staffNameId &&
                            formik.errors.staffNameId
                        )}
                        fullWidth
                        helperText={
                          formik.touched.staffNameId &&
                          formik.errors.staffNameId
                        }
                        label="Lead/Staff Name"
                        name="staffNameId"
                        variant="outlined"
                        my={2}
                      />
                    )}
                  />
                </Grid>
                <Grid item md={6}>
                  <Autocomplete
                    id="countryId"
                    multiple
                    options={
                      !isLoadingAmrefEntities && !isErrorAmrefEntities
                        ? amrefEntities.data
                        : []
                    }
                    getOptionLabel={(entity) => `${entity?.name}`}
                    renderOption={(props, option) => {
                      return (
                        <li {...props} key={option.id}>
                          {option.name}
                        </li>
                      );
                    }}
                    onChange={(_, val) =>
                      formik.setFieldValue("countryId", val)
                    }
                    value={formik.values.countryId}
                    disabled={true}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={Boolean(
                          formik.touched.countryId && formik.errors.countryId
                        )}
                        fullWidth
                        helperText={
                          formik.touched.countryId && formik.errors.countryId
                        }
                        label="Select Countries/entities of implementation"
                        name="countryId"
                        variant="outlined"
                        my={2}
                      />
                    )}
                  />
                </Grid>
                <Grid item md={6}></Grid>
                <Grid item md={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="From"
                      value={formik.values.duration_from}
                      onChange={(value) =>
                        formik.setFieldValue("duration_from", value, true)
                      }
                      renderInput={(params) => (
                        <TextField
                          error={Boolean(
                            formik.touched.duration_from &&
                              formik.errors.duration_from
                          )}
                          helperText={
                            formik.touched.duration_from &&
                            formik.errors.duration_from
                          }
                          margin="normal"
                          name="duration_from"
                          variant="outlined"
                          fullWidth
                          my={2}
                          {...params}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item md={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="To"
                      value={formik.values.duration_to}
                      onChange={(value) =>
                        formik.setFieldValue("duration_to", value, true)
                      }
                      renderInput={(params) => (
                        <TextField
                          error={Boolean(
                            formik.touched.duration_to &&
                              formik.errors.duration_to
                          )}
                          helperText={
                            formik.touched.duration_to &&
                            formik.errors.duration_to
                          }
                          margin="normal"
                          name="duration_to"
                          variant="outlined"
                          fullWidth
                          my={2}
                          {...params}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item md={6}>
                  <TextField
                    name="currentStageId"
                    label="Current stage of the innovation"
                    select
                    required
                    value={formik.values.currentStageId}
                    error={Boolean(
                      formik.touched.currentStageId &&
                        formik.errors.currentStageId
                    )}
                    fullWidth
                    helperText={
                      formik.touched.currentStageId &&
                      formik.errors.currentStageId
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select current stage of the innovation
                    </MenuItem>
                    {!isLoadingInnovationStageData &&
                    !isErrorInnovationStageData
                      ? InnovationStageData.data.map((option) => (
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
                <Grid item md={12}>
                  <TextField
                    name="updateProgress"
                    label="Update progress on innovation from last quarter or from setup"
                    value={formik.values.updateProgress}
                    error={Boolean(
                      formik.touched.updateProgress &&
                        formik.errors.updateProgress
                    )}
                    fullWidth
                    helperText={
                      formik.touched.updateProgress &&
                      formik.errors.updateProgress
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    multiline
                    variant="outlined"
                    rows={3}
                    my={2}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    name="bragStatusId"
                    label="BRAG Status"
                    select
                    required
                    value={formik.values.bragStatusId}
                    error={Boolean(
                      formik.touched.bragStatusId && formik.errors.bragStatusId
                    )}
                    fullWidth
                    helperText={
                      formik.touched.bragStatusId && formik.errors.bragStatusId
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select BRAG Status
                    </MenuItem>
                    {!isLoadingBRAGStatusData && !isErrorBRAGStatusData
                      ? BRAGStatusData.data.map((option) => (
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
                <Grid item md={12}>
                  <TextField
                    name="plaDeviations"
                    label="Update any deviations from original plan for innovation"
                    value={formik.values.plaDeviations}
                    error={Boolean(
                      formik.touched.plaDeviations &&
                        formik.errors.plaDeviations
                    )}
                    fullWidth
                    helperText={
                      formik.touched.plaDeviations &&
                      formik.errors.plaDeviations
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    multiline
                    variant="outlined"
                    rows={3}
                    my={2}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={12}>
                <Grid item md={12}>
                  <ThemeProvider theme={theme}>
                    <Button
                      variant="contained"
                      color="neutral"
                      onClick={() => setOpenChallengesModal(true)}
                    >
                      <AddIcon /> ADD CHALLENGES
                    </Button>
                  </ThemeProvider>
                </Grid>
              </Grid>
              <Grid container spacing={12}>
                <Grid item md={12}>
                  <Paper>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="left">CHALLENGE</TableCell>
                          <TableCell align="left">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {challengesArray.map((row, index) => (
                          <TableRow key={Math.random().toString(36)}>
                            <TableCell component="th" scope="row">
                              {row.challenge}
                            </TableCell>
                            <TableCell align="left">
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => removeChallenge(index)}
                              >
                                <DeleteIcon />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                </Grid>
              </Grid>
              <br />
              <Button type="submit" variant="contained" color="primary" mt={3}>
                Save
              </Button>
            </>
          )}
        </CardContent>
      </Card>
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={openChallengesModal}
        onClose={() => setOpenChallengesModal(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">CHALLENGES</DialogTitle>
        <DialogContent>
          <DialogContentText>ADD CHALLENGE</DialogContentText>
          <InnovationChallengesForm handleClick={handleClick} />
        </DialogContent>
      </Dialog>
    </form>
  );
};
export default InnovationMonitoringForm;
