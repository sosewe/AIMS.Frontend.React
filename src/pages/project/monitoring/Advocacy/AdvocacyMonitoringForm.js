import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
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
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Guid } from "../../../../utils/guid";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAdvocacyById, getAdvocates } from "../../../../api/advocacy";
import { getAMREFStaffList } from "../../../../api/lookup";
import { getAllThematicAreas } from "../../../../api/thematic-area";
import { getAmrefEntities } from "../../../../api/amref-entity";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getQualitativeCountryByTypeItemId } from "../../../../api/qualitative-country";
import { getQualitativeThematicAreaByTypeItemId } from "../../../../api/qualitative-thematic-area";
import AdvocacyMonitoringProgress from "./AdvocacyMonitoringProgress";
import AdvocacyMonitoringMilestoneYear from "./AdvocacyMonitoringMilestoneYear";
import AdvocacyMonitoringMilestoneQuarter from "./AdvocacyMonitoringMilestoneQuarter";
import { newAdvocacyMilestoneProgress } from "../../../../api/advocacy-milestone-progress";
import { newAdvocacyProgress } from "../../../../api/advocacy-progress";
import { useParams } from "react-router-dom";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);
const Autocomplete = styled(MuiAutocomplete)(spacing);
const TextField = styled(MuiTextField)(spacing);

const initialValues = {
  name: "",
  staffNameId: "",
  thematicAreaId: "",
  countryId: [],
  duration_from: "",
  duration_to: "",
  currentStageId: "",
  updateProgress: "",
  bragStatusId: "",
};

const AdvocacyMonitoringForm = () => {
  let { id } = useParams();
  const [openMilestoneProgressModal, setOpenMilestoneProgressModal] =
    useState(false);
  const [advocacyMilestone, setAdvocacyMilestone] = useState();
  const [advocacyId, setAdvocacyId] = useState();
  const [advocacy, setAdvocacy] = useState();
  const {
    data: AdvocacyData,
    isLoading: isLoadingAdvocacyData,
    isError: isErrorAdvocacyData,
  } = useQuery(["getAdvocacyById", advocacyId], getAdvocacyById, {
    enabled: !!advocacyId,
  });
  const {
    data: QualitativeCountryData,
    isLoading: isLoadingQualitativeCountry,
    isError: isErrorQualitativeCountry,
  } = useQuery(
    ["getQualitativeCountryByTypeItemId", advocacyId],
    getQualitativeCountryByTypeItemId,
    { enabled: !!advocacyId }
  );
  const {
    data: QualitativeThematicAreaData,
    isLoading: isLoadingQualitativeThematicArea,
    isError: isErrorQualitativeThematicAreaData,
  } = useQuery(
    ["getQualitativeThematicAreaByTypeItemId", advocacyId],
    getQualitativeThematicAreaByTypeItemId,
    { enabled: !!advocacyId }
  );
  const {
    data: AdvocacyAllData,
    isLoading: isLoadingAdvocacyAllData,
    isError: isErrorAdvocacyAllData,
  } = useQuery(["getAdvocates"], getAdvocates, {
    refetchOnWindowFocus: false,
  });
  const {
    isLoading: isLoadingStaffList,
    isError: isErrorStaffList,
    data: staffListData,
  } = useQuery(["staffList"], getAMREFStaffList, {
    refetchOnWindowFocus: false,
    retry: 0,
  });
  const {
    data: ThematicAreas,
    isLoading: isLoadingThematicAreas,
    isError: isErrorThematicAreas,
  } = useQuery(["getAllThematicAreas"], getAllThematicAreas, {
    refetchOnWindowFocus: false,
  });
  const {
    isLoading: isLoadingAmrefEntities,
    data: amrefEntities,
    isError: isErrorAmrefEntities,
  } = useQuery(["amrefEntities"], getAmrefEntities, {
    refetchOnWindowFocus: false,
  });

  const onAdvocacyNameChange = (event, val) => {
    setAdvocacyId(val.id);
    setAdvocacy(val);
  };

  const mutationAdvocacyMilestoneProgress = useMutation({
    mutationFn: newAdvocacyMilestoneProgress,
  });
  const mutationAdvocacyProgress = useMutation({
    mutationFn: newAdvocacyProgress,
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      name: Yup.object().required("Required"),
      staffNameId: Yup.object().required("Required"),
      thematicAreaId: Yup.string().required("Required"),
      countryId: Yup.array().required("Required"),
      duration_from: Yup.date().required("Required"),
      duration_to: Yup.date().required("Required"),
      currentStageId: Yup.string().required("Required"),
      updateProgress: Yup.string().required("Required"),
      bragStatusId: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        values.id = new Guid().toString();
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  useEffect(() => {
    function setCurrentFormValues() {
      setAdvocacyId(id);
      if (
        !isLoadingAdvocacyData &&
        !isErrorAdvocacyData &&
        !isErrorStaffList &&
        !isLoadingStaffList &&
        !isLoadingQualitativeCountry &&
        !isErrorQualitativeCountry
      ) {
        let staff;
        let countries = [];
        let thematicArea;
        if (!isErrorStaffList && !isLoadingStaffList) {
          staff = staffListData.data.find(
            (obj) => obj.id === AdvocacyData.data.staffNameId
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
        if (
          !isLoadingQualitativeThematicArea &&
          !isErrorQualitativeThematicAreaData
        ) {
          thematicArea = QualitativeThematicAreaData.data[0].thematicAreaId;
        }
        formik.setValues({
          name: AdvocacyData.data,
          staffNameId: staff ? staff : "",
          countryId: countries && countries.length > 0 ? countries : [],
          thematicAreaId: thematicArea ? thematicArea : "",
          duration_from: "",
          duration_to: "",
          currentStageId: "",
          updateProgress: "",
          bragStatusId: "",
        });
      }
    }
    setCurrentFormValues();
  }, [
    isLoadingAdvocacyData,
    isErrorAdvocacyData,
    AdvocacyData,
    QualitativeCountryData,
    advocacy,
    amrefEntities,
    isErrorStaffList,
    isLoadingStaffList,
    staffListData,
    isLoadingQualitativeThematicArea,
    isErrorQualitativeThematicAreaData,
    QualitativeThematicAreaData,
    isErrorQualitativeCountry,
    isLoadingQualitativeCountry,
    id,
  ]);

  const updateMilestoneProgress = (event, row) => {
    setAdvocacyMilestone(row);
    setOpenMilestoneProgressModal(true);
  };

  const handleClick = async (values) => {
    try {
      const advocacyProgress = {
        id: new Guid().toString(),
        createDate: new Date(),
        advocacyId: advocacyMilestone.advocacyId,
        yearId: advocacyMilestone.yearId,
        quarterId: advocacyMilestone.quarterId,
        updateProgress: values.updateProgress,
      };
      const result = await mutationAdvocacyProgress.mutateAsync(
        advocacyProgress
      );
      const advocacyMilestoneProgress = {
        id: new Guid().toString(),
        createDate: new Date(),
        advocacyProgressId: result.data.id,
        advocacyMilestoneId: advocacyMilestone.id,
        yearId: advocacyMilestone.yearId,
        quarterId: advocacyMilestone.quarterId,
        bragStatusId: values.bragStatusId,
        planDeviation: values.planDeviation,
      };
      await mutationAdvocacyMilestoneProgress.mutateAsync(
        advocacyMilestoneProgress
      );
      setOpenMilestoneProgressModal(false);
      toast("Successfully Updated Milestone Progress", {
        type: "success",
      });
    } catch (error) {
      toast(error.response.data, {
        type: "error",
      });
    }
  };

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
                      !isLoadingAdvocacyAllData && !isErrorAdvocacyAllData
                        ? AdvocacyAllData.data
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
                      onAdvocacyNameChange(e, val);
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
                  <TextField
                    name="thematicAreaId"
                    label="Thematic Area(s)"
                    select
                    value={formik.values.thematicAreaId}
                    error={Boolean(
                      formik.touched.thematicAreaId &&
                        formik.errors.thematicAreaId
                    )}
                    fullWidth
                    helperText={
                      formik.touched.thematicAreaId &&
                      formik.errors.thematicAreaId
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                    disabled={true}
                  >
                    <MenuItem disabled value="">
                      Select Thematic Area(s)
                    </MenuItem>
                    {!isLoadingThematicAreas && !isErrorThematicAreas
                      ? ThematicAreas.data.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}({option.initial})
                          </MenuItem>
                        ))
                      : []}
                  </TextField>
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
                <Grid item md={12}>
                  <Paper>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="left">MILESTONE</TableCell>
                          <TableCell align="left">Year</TableCell>
                          <TableCell align="left">Quarter</TableCell>
                          <TableCell align="left">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {!isLoadingAdvocacyData && !isErrorAdvocacyData
                          ? AdvocacyData.data.advocacyMilestones.map((row) => (
                              <TableRow key={Math.random().toString(36)}>
                                <TableCell component="th" scope="row">
                                  {row.milestone}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  <AdvocacyMonitoringMilestoneYear
                                    yearId={row.yearId}
                                  />
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  <AdvocacyMonitoringMilestoneQuarter
                                    quarterId={row.quarterId}
                                  />
                                </TableCell>
                                <TableCell align="left">
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={(e) =>
                                      updateMilestoneProgress(e, row)
                                    }
                                  >
                                    Update Progress
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          : []}
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
        open={openMilestoneProgressModal}
        onClose={() => setOpenMilestoneProgressModal(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">UPDATE PROGRESS</DialogTitle>
        <DialogContent>
          <DialogContentText>UPDATE PROGRESS</DialogContentText>
          <AdvocacyMonitoringProgress handleClick={handleClick} />
        </DialogContent>
      </Dialog>
    </form>
  );
};
export default AdvocacyMonitoringForm;
