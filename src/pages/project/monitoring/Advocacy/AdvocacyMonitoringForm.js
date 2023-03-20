import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  Autocomplete as MuiAutocomplete,
  Box,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CircularProgress,
  Grid,
  MenuItem,
  Paper as MuiPaper,
  TextField as MuiTextField,
} from "@mui/material";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Guid } from "../../../../utils/guid";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getAdvocates } from "../../../../api/advocacy";
import { getAMREFStaffList } from "../../../../api/lookup";
import { getAllThematicAreas } from "../../../../api/thematic-area";
import { getAmrefEntities } from "../../../../api/amref-entity";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);
const Autocomplete = styled(MuiAutocomplete)(spacing);
const TextField = styled(MuiTextField)(spacing);

const initialValues = {};

const AdvocacyMonitoringForm = () => {
  const {
    data: AdvocacyData,
    isLoading: isLoadingAdvocacy,
    isError: isErrorAdvocacy,
    error,
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
    // setInnovationId(val.id);
    // setInnovation(val);
  };

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
        values.id = new Guid().toString();
      } catch (error) {
        console.log(error);
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
              <Grid container item spacing={2}>
                <Grid item md={6}>
                  <Autocomplete
                    id="name"
                    options={
                      !isLoadingAdvocacy && !isErrorAdvocacy
                        ? AdvocacyData.data
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
              </Grid>
              <br />
              <Button type="submit" variant="contained" color="primary" mt={3}>
                Save
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </form>
  );
};
export default AdvocacyMonitoringForm;
