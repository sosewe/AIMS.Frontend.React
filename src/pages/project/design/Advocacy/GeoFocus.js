import React, { useEffect, useState, useCallback } from "react";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  Paper as MuiPaper,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdministrativeUnitById,
  getAdministrativeUnitByParentName,
  getAdministrativeUnitTopLevel,
} from "../../../../api/administrative-unit";
import { Check, Trash as TrashIcon, ChevronLeft } from "react-feather";
import {
  newAdvocacyGeographicalFocus,
  deleteAdvocacyGeographicalFocus,
  getAdvocacyGeographicalFocus,
} from "../../../../api/advocacy-geographical-focus";
import { DataGrid } from "@mui/x-data-grid";
import useKeyCloakAuth from "../../../../hooks/useKeyCloakAuth";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const Paper = styled(MuiPaper)(spacing);

const getFocusInitial = {
  selectedCountry: "",
  firstLevel: "",
  secondLevel: "",
  thirdLevel: "",
  fourthLevel: "",
};

const GeoFocus = (props) => {
  const id = props.id;
  const onActionChange = props.onActionChange;
  const queryClient = useQueryClient();
  const [parentTopLevel, setParentTopLevel] = useState();
  const [firstLevel, setFirstLevel] = useState();
  const [secondLevel, setSecondLevel] = useState();
  const [thirdLevel, setThirdLevel] = useState();

  const [firstLevelDisabled, setFirstLevelDisabled] = useState(true);
  const [secondLevelDisabled, setSecondLevelDisabled] = useState(true);
  const [thirdLevelDisabled, setThirdLevelDisabled] = useState(true);
  const [fourthLevelDisabled, setFourthLevelDisabled] = useState(true);

  const [open, setOpen] = React.useState(false);
  const [locationId, setLocationId] = React.useState();

  const user = useKeyCloakAuth();

  const {
    data: AdvocacyLocationsData,
    isLoading: isLoadingAdvocacyLocations,
    // refetch,
  } = useQuery(
    ["getAdvocacyGeographicalFocus", id],
    getAdvocacyGeographicalFocus,
    {
      refetchOnWindowFocus: false,
      enabled: !!id,
    }
  );

  const GetAdministrativeUnit = (params) => {
    const administrativeUnitId = params.value;
    const { data: result, isLoading } = useQuery(
      ["getAdministrativeUnitById", administrativeUnitId],
      getAdministrativeUnitById,
      {
        refetchOnWindowFocus: false,
        keepPreviousData: true,
      }
    );
    if (!isLoading && result && result.data) {
      return result.data.adminUnit;
    }
  };

  const mutation = useMutation({ mutationFn: newAdvocacyGeographicalFocus });
  const formik = useFormik({
    initialValues: getFocusInitial,
    validationSchema: Yup.object().shape({
      selectedCountry: Yup.object().required("Required"),
      firstLevel: Yup.object().when("selectedCountry", {
        is: () => onValidateFirstLevel(),
        then: Yup.object().required("FirstLevel required"),
        otherwise: Yup.object().notRequired(),
      }),
      secondLevel: Yup.object().when("firstLevel", {
        is: () => onValidateSecondLevel(),
        then: Yup.object().required("SecondLevel required"),
        otherwise: Yup.object().notRequired(),
      }),
      thirdLevel: Yup.object().when("secondLevel", {
        is: () => onValidateThirdLevel(),
        then: Yup.object().required("ThirdLevel required"),
        otherwise: Yup.object().notRequired(),
      }),
      fourthLevel: Yup.object().when("thirdLevel", {
        is: () => onValidateFourthLevel(),
        then: Yup.object().required("FourthLevel required"),
        otherwise: Yup.object().notRequired(),
      }),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        let administrativeUnitId = "";
        let administrativeUnitName = "";
        let administrativeUnitCountryId = "";
        let administrativeUnitCountryName = "";
        if (values.selectedCountry) {
          administrativeUnitCountryId = values.selectedCountry.id;
          administrativeUnitCountryName = values.selectedCountry.adminUnit;
        }

        if (
          values.selectedCountry &&
          !values.firstLevel &&
          !values.secondLevel &&
          !values.thirdLevel &&
          !values.fourthLevel
        ) {
          administrativeUnitId = values.selectedCountry.id;
          administrativeUnitName = values.selectedCountry.adminUnit;
        } else if (
          values.firstLevel &&
          !values.secondLevel &&
          !values.thirdLevel &&
          !values.fourthLevel
        ) {
          administrativeUnitId = values.firstLevel.id;
          administrativeUnitName = values.firstLevel.adminUnit;
        } else if (
          values.secondLevel &&
          !values.thirdLevel &&
          !values.fourthLevel
        ) {
          administrativeUnitId = values.secondLevel.id;
          administrativeUnitName = values.secondLevel.adminUnit;
        } else if (values.thirdLevel && !values.fourthLevel) {
          administrativeUnitId = values.thirdLevel.id;
          administrativeUnitName = values.thirdLevel.adminUnit;
        } else if (values.fourthLevel) {
          administrativeUnitId = values.fourthLevel.id;
          administrativeUnitName = values.fourthLevel.adminUnit;
        }

        const advocacyLocation = {
          advocacyId: id,
          createDate: new Date(),
          administrativeUnitId,
          administrativeUnitName,
          administrativeUnitCountryId,
          administrativeUnitCountryName,
          userId: user.sub,
        };

        console.log("advocacyLocation ..." + JSON.stringify(advocacyLocation));

        await mutation.mutateAsync(advocacyLocation);
        await queryClient.invalidateQueries(["getAdvocacyGeographicalFocus"]);
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
  const { data, isLoading, isError } = useQuery(
    ["topLevelAdminUnit"],
    getAdministrativeUnitTopLevel,
    {
      refetchOnWindowFocus: false,
    }
  );
  const { data: firstLevelData, isLoading: isLoadingFirstLevel } = useQuery(
    ["firstLevelQuery", parentTopLevel],
    getAdministrativeUnitByParentName,
    {
      refetchOnWindowFocus: false,
      enabled: !!parentTopLevel,
    }
  );
  const { data: secondLevelData, isLoading: isLoadingSecondLevel } = useQuery(
    ["secondLevelQuery", firstLevel],
    getAdministrativeUnitByParentName,
    {
      refetchOnWindowFocus: false,
      enabled: !!firstLevel,
    }
  );
  const { data: thirdLevelData, isLoading: isLoadingThirdLevel } = useQuery(
    ["thirdLevelQuery", secondLevel],
    getAdministrativeUnitByParentName,
    {
      refetchOnWindowFocus: false,
      enabled: !!secondLevel,
    }
  );
  const { data: fourthLevelData, isLoading: isLoadingFourthLevel } = useQuery(
    ["fourthLevelQuery", thirdLevel],
    getAdministrativeUnitByParentName,
    {
      refetchOnWindowFocus: false,
      enabled: !!thirdLevel,
    }
  );

  const onSelectedCountry = (e) => {
    setParentTopLevel(e.target.value.adminUnit);
    formik.setFieldValue("firstLevel", "");
    formik.setFieldValue("secondLevel", "");
    formik.setFieldValue("thirdLevel", "");
    formik.setFieldValue("fourthLevel", "");
    setFirstLevelDisabled(false);
    setSecondLevelDisabled(true);
    setThirdLevelDisabled(true);
    setFourthLevelDisabled(true);
    formik.setFieldTouched("firstLevel", false);
    formik.setFieldTouched("secondLevel", false);
    formik.setFieldTouched("thirdLevel", false);
    formik.setFieldTouched("fourthLevel", false);
  };

  const onFirstLevelSelected = (e) => {
    setFirstLevel(e.target.value.adminUnit);
    setSecondLevelDisabled(false);
    setThirdLevelDisabled(true);
    setFourthLevelDisabled(true);
    formik.setFieldValue("secondLevel", "");
    formik.setFieldValue("thirdLevel", "");
    formik.setFieldValue("fourthLevel", "");
    formik.setFieldTouched("secondLevel", false);
    formik.setFieldTouched("thirdLevel", false);
    formik.setFieldTouched("fourthLevel", false);
  };

  const onSecondLevelSelected = (e) => {
    setSecondLevel(e.target.value.adminUnit);
    setThirdLevelDisabled(false);
    setFourthLevelDisabled(true);
    formik.setFieldValue("thirdLevel", "");
    formik.setFieldValue("fourthLevel", "");
    formik.setFieldTouched("thirdLevel", false);
    formik.setFieldTouched("fourthLevel", false);
  };

  const onThirdLevelSelected = (e) => {
    setThirdLevel(e.target.value.adminUnit);
    setFourthLevelDisabled(false);
    formik.setFieldValue("fourthLevel", "");
    formik.setFieldTouched("fourthLevel", false);
  };

  const onValidateFirstLevel = () => {
    return !(
      firstLevelDisabled ||
      (!isLoadingFirstLevel && firstLevelData.data.length === 0)
    );
  };

  const onValidateSecondLevel = () => {
    return !(
      secondLevelDisabled ||
      (!isLoadingSecondLevel && secondLevelData.data.length === 0)
    );
  };

  const onValidateThirdLevel = () => {
    return !(
      thirdLevelDisabled ||
      (!isLoadingThirdLevel && thirdLevelData.data.length === 0)
    );
  };

  const onValidateFourthLevel = () => {
    return !(
      fourthLevelDisabled ||
      (!isLoadingFourthLevel && fourthLevelData.data.length === 0)
    );
  };

  const { refetch } = useQuery(
    ["deleteAdvocacyGeographicalFocus", locationId],
    deleteAdvocacyGeographicalFocus,
    { enabled: false }
  );

  const handleClickOpen = (locationId) => {
    setOpen(true);
    setLocationId(locationId);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteAdvocacyLocation = async () => {
    await refetch();
    setOpen(false);
    await queryClient.invalidateQueries(["getAdvocacyGeographicalFocus"]);
  };

  const handleActionChange = useCallback(
    (event) => {
      onActionChange({ id: 0, status: 1 });
    },
    [onActionChange]
  );

  return (
    <React.Fragment>
      <Grid item md={12}>
        <Typography variant="h3" gutterBottom display="inline">
          Geographical Focus
        </Typography>
      </Grid>
      <Grid item md={12} mt={5}>
        <Divider my={6} />
      </Grid>
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <Paper style={{ height: 250, width: "100%" }}>
                <DataGrid
                  rowsPerPageOptions={[5, 10, 25]}
                  rows={
                    isLoadingAdvocacyLocations
                      ? []
                      : AdvocacyLocationsData
                      ? AdvocacyLocationsData.data
                      : []
                  }
                  columns={[
                    {
                      field: "administrativeUnitCountryId",
                      headerName: "Administrative Country",
                      editable: false,
                      flex: 1,
                      valueGetter: GetAdministrativeUnit,
                    },
                    {
                      field: "administrativeUnitId",
                      headerName: "Administrative Unit",
                      editable: false,
                      flex: 1,
                      valueGetter: GetAdministrativeUnit,
                    },
                    {
                      field: "action",
                      headerName: "Action",
                      sortable: false,
                      flex: 1,
                      renderCell: (params) => (
                        <>
                          <Button
                            startIcon={<TrashIcon />}
                            size="small"
                            onClick={() => handleClickOpen(params.id)}
                          ></Button>
                        </>
                      ),
                    },
                  ]}
                  loading={isLoadingAdvocacyLocations}
                />
              </Paper>
            </Grid>
            <Grid item md={12}>
              <form onSubmit={formik.handleSubmit}>
                <Grid container item spacing={2}>
                  <Grid item md={2}>
                    <TextField
                      name="selectedCountry"
                      label="Select Country"
                      select
                      value={formik.values.selectedCountry}
                      error={Boolean(
                        formik.touched.selectedCountry &&
                          formik.errors.selectedCountry
                      )}
                      fullWidth
                      helperText={
                        formik.touched.selectedCountry &&
                        formik.errors.selectedCountry
                      }
                      onBlur={formik.handleBlur}
                      onChange={(e) => {
                        formik.handleChange(e);
                        onSelectedCountry(e);
                      }}
                      variant="outlined"
                      my={2}
                    >
                      <MenuItem disabled value="">
                        Select Country
                      </MenuItem>
                      {!isLoading &&
                      !isError &&
                      data.data &&
                      data.data.length > 0
                        ? data.data.map((option) => (
                            <MenuItem key={option.id} value={option}>
                              {option.adminUnit}
                            </MenuItem>
                          ))
                        : []}
                    </TextField>
                  </Grid>
                  <Grid item md={2}>
                    <TextField
                      name="firstLevel"
                      label="Select First Level"
                      select
                      value={formik.values.firstLevel}
                      error={Boolean(
                        formik.touched.firstLevel && formik.errors.firstLevel
                      )}
                      fullWidth
                      helperText={
                        formik.touched.firstLevel && formik.errors.firstLevel
                      }
                      onBlur={formik.handleBlur}
                      onChange={(e) => {
                        formik.handleChange(e);
                        onFirstLevelSelected(e);
                      }}
                      variant="outlined"
                      my={2}
                      disabled={
                        firstLevelDisabled ||
                        (!isLoadingFirstLevel &&
                          firstLevelData.data.length === 0)
                      }
                    >
                      <MenuItem disabled value="">
                        Select First Level
                      </MenuItem>
                      {!isLoadingFirstLevel &&
                      firstLevelData.data &&
                      firstLevelData.data.length > 0
                        ? firstLevelData.data.map((option) => (
                            <MenuItem key={option.id} value={option}>
                              {option.adminUnit}
                            </MenuItem>
                          ))
                        : []}
                    </TextField>
                  </Grid>
                  <Grid item md={2}>
                    <TextField
                      name="secondLevel"
                      label="Select Second Level"
                      select
                      value={formik.values.secondLevel}
                      error={Boolean(
                        formik.touched.secondLevel && formik.errors.secondLevel
                      )}
                      fullWidth
                      helperText={
                        formik.touched.secondLevel && formik.errors.secondLevel
                      }
                      onBlur={formik.handleBlur}
                      onChange={(e) => {
                        formik.handleChange(e);
                        onSecondLevelSelected(e);
                      }}
                      variant="outlined"
                      my={2}
                      disabled={
                        secondLevelDisabled ||
                        (!isLoadingSecondLevel &&
                          secondLevelData.data.length === 0)
                      }
                    >
                      <MenuItem disabled value="">
                        Select Second Level
                      </MenuItem>
                      {!isLoadingSecondLevel &&
                      secondLevelData.data &&
                      secondLevelData.data.length > 0
                        ? secondLevelData.data.map((option) => (
                            <MenuItem key={option.id} value={option}>
                              {option.adminUnit}
                            </MenuItem>
                          ))
                        : []}
                    </TextField>
                  </Grid>
                  <Grid item md={2}>
                    <TextField
                      name="thirdLevel"
                      label="Select Third Level"
                      select
                      value={formik.values.thirdLevel}
                      error={Boolean(
                        formik.touched.thirdLevel && formik.errors.thirdLevel
                      )}
                      fullWidth
                      helperText={
                        formik.touched.thirdLevel && formik.errors.thirdLevel
                      }
                      onBlur={formik.handleBlur}
                      onChange={(e) => {
                        formik.handleChange(e);
                        onThirdLevelSelected(e);
                      }}
                      variant="outlined"
                      my={2}
                      disabled={
                        thirdLevelDisabled ||
                        (!isLoadingThirdLevel &&
                          thirdLevelData.data.length === 0)
                      }
                    >
                      <MenuItem disabled value="">
                        Select Third Level
                      </MenuItem>
                      {!isLoadingThirdLevel &&
                      thirdLevelData.data &&
                      thirdLevelData.data.length > 0
                        ? thirdLevelData.data.map((option) => (
                            <MenuItem key={option.id} value={option}>
                              {option.adminUnit}
                            </MenuItem>
                          ))
                        : []}
                    </TextField>
                  </Grid>
                  <Grid item md={2}>
                    <TextField
                      name="fourthLevel"
                      label="Select Fourth Level"
                      select
                      value={formik.values.fourthLevel}
                      error={Boolean(
                        formik.touched.fourthLevel && formik.errors.fourthLevel
                      )}
                      fullWidth
                      helperText={
                        formik.touched.fourthLevel && formik.errors.fourthLevel
                      }
                      onBlur={formik.handleBlur}
                      onChange={(e) => {
                        formik.handleChange(e);
                      }}
                      variant="outlined"
                      my={2}
                      disabled={
                        fourthLevelDisabled ||
                        (!isLoadingFourthLevel &&
                          fourthLevelData.data.length === 0)
                      }
                    >
                      <MenuItem disabled value="">
                        Select Fourth Level
                      </MenuItem>
                      {!isLoadingFourthLevel &&
                      fourthLevelData.data &&
                      fourthLevelData.data.length > 0
                        ? fourthLevelData.data.map((option) => (
                            <MenuItem key={option.id} value={option}>
                              {option.adminUnit}
                            </MenuItem>
                          ))
                        : []}
                    </TextField>
                  </Grid>
                </Grid>
                <br />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  mt={3}
                  onClick={() => handleActionChange()}
                >
                  <ChevronLeft /> Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  mt={3}
                  ml={3}
                >
                  <Check /> Save Location
                </Button>
              </form>
            </Grid>
          </Grid>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Delete Advocacy Location
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete Advocacy Location?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteAdvocacyLocation} color="primary">
                Yes
              </Button>
              <Button onClick={handleClose} color="error" autoFocus>
                No
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};
export default GeoFocus;
