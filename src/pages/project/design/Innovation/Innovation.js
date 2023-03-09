import React from "react";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Grid,
  MenuItem,
  TextField as MuiTextField,
  Autocomplete as MuiAutocomplete,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import * as Yup from "yup";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAMREFStaffList } from "../../../../api/lookup";
import { getAllThematicAreas } from "../../../../api/thematic-area";
import { getAmrefEntities } from "../../../../api/amref-entity";
import { newInnovation } from "../../../../api/innovation";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Autocomplete = styled(MuiAutocomplete)(spacing);
const Button = styled(MuiButton)(spacing);

const initialValues = {
  title: "",
  dateOfEntry: "",
  duration_from: "",
  duration_to: "",
  staffNameId: "",
  thematicAreaId: "",
  countryId: "",
  proposedSolution: "",
  targetBeneficiary: "",
  difference: "",
  scaling: "",
  sustainability: "",
};
const InnovationForm = ({ processLevelItemId, processLevelTypeId }) => {
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
  const mutation = useMutation({ mutationFn: newInnovation });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      title: Yup.string().required("Required"),
      dateOfEntry: Yup.date().required("Required"),
      duration_from: Yup.date().required("Required"),
      duration_to: Yup.date().required("Required"),
      thematicAreaId: Yup.string().required("Required"),
      countryId: Yup.array().required("Required"),
      staffNameId: Yup.string().required("Required"),
      proposedSolution: Yup.string().required("Required"),
      targetBeneficiary: Yup.string().required("Required"),
      difference: Yup.string().required("Required"),
      scaling: Yup.string().required("Required"),
      sustainability: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const saveInnovation = {
          createDate: new Date(),
          title: values.title,
          staffNameId: values.staffNameId,
          proposedSolution: values.proposedSolution,
          targetBeneficiary: values.targetBeneficiary,
          difference: values.difference,
          scaling: values.scaling,
          sustainability: values.sustainability,
          processLevelItemId: processLevelItemId,
          processLevelTypeId: processLevelTypeId,
        };
        await mutation.mutateAsync(saveInnovation);
        toast("Successfully Created an Innovation", {
          type: "success",
        });
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container item spacing={2}>
        <Grid item md={12}>
          <TextField
            name="title"
            label="Title"
            value={formik.values.title}
            error={Boolean(formik.touched.title && formik.errors.title)}
            fullWidth
            helperText={formik.touched.title && formik.errors.title}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            multiline
            variant="outlined"
            my={2}
            rows={3}
          />
        </Grid>
        <Grid item md={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date Of Entry"
              value={formik.values.dateOfEntry}
              onChange={(value) =>
                formik.setFieldValue("dateOfEntry", value, true)
              }
              renderInput={(params) => (
                <TextField
                  error={Boolean(
                    formik.touched.dateOfEntry && formik.errors.dateOfEntry
                  )}
                  helperText={
                    formik.touched.dateOfEntry && formik.errors.dateOfEntry
                  }
                  margin="normal"
                  name="dateOfEntry"
                  variant="outlined"
                  fullWidth
                  my={2}
                  {...params}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item md={4}>
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
                    formik.touched.duration_from && formik.errors.duration_from
                  )}
                  helperText={
                    formik.touched.duration_from && formik.errors.duration_from
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
        <Grid item md={4}>
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
                    formik.touched.duration_to && formik.errors.duration_to
                  )}
                  helperText={
                    formik.touched.duration_to && formik.errors.duration_to
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
        <Grid item md={4}>
          <Autocomplete
            id="staffNameId"
            options={
              !isLoadingStaffList && !isErrorStaffList ? staffListData.data : []
            }
            getOptionLabel={(staff) => `${staff?.firstName} ${staff?.lastName}`}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  {option.firstName} {option.lastName}
                </li>
              );
            }}
            onChange={(_, val) => formik.setFieldValue("staffNameId", val.id)}
            renderInput={(params) => (
              <TextField
                {...params}
                error={Boolean(
                  formik.touched.staffNameId && formik.errors.staffNameId
                )}
                fullWidth
                helperText={
                  formik.touched.staffNameId && formik.errors.staffNameId
                }
                label="Lead/Staff Name"
                name="staffNameId"
                variant="outlined"
                my={2}
              />
            )}
          />
        </Grid>
        <Grid item md={4}>
          <TextField
            name="thematicAreaId"
            label="Thematic Area(s)"
            select
            value={formik.values.thematicAreaId}
            error={Boolean(
              formik.touched.thematicAreaId && formik.errors.thematicAreaId
            )}
            fullWidth
            helperText={
              formik.touched.thematicAreaId && formik.errors.thematicAreaId
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
        <Grid item md={4}>
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
            onChange={(_, val) => formik.setFieldValue("countryId", val)}
            renderInput={(params) => (
              <TextField
                {...params}
                error={Boolean(
                  formik.touched.countryId && formik.errors.countryId
                )}
                fullWidth
                helperText={formik.touched.countryId && formik.errors.countryId}
                label="Select Countries/entities of implementation"
                name="countryId"
                variant="outlined"
                my={2}
              />
            )}
          />
        </Grid>
        <Grid item md={12}>
          <TextField
            name="proposedSolution"
            label="What is the proposed solution?"
            value={formik.values.proposedSolution}
            error={Boolean(
              formik.touched.proposedSolution && formik.errors.proposedSolution
            )}
            fullWidth
            helperText={
              formik.touched.proposedSolution && formik.errors.proposedSolution
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
            name="targetBeneficiary"
            label="Who are the target beneficiaries?"
            value={formik.values.targetBeneficiary}
            error={Boolean(
              formik.touched.targetBeneficiary &&
                formik.errors.targetBeneficiary
            )}
            fullWidth
            helperText={
              formik.touched.targetBeneficiary &&
              formik.errors.targetBeneficiary
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
            name="difference"
            label="What difference will the innovation make as a result?"
            value={formik.values.difference}
            error={Boolean(
              formik.touched.difference && formik.errors.difference
            )}
            fullWidth
            helperText={formik.touched.difference && formik.errors.difference}
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
            name="scaling"
            label="How will this be scaled up?(if it's not scaled up why)"
            value={formik.values.scaling}
            error={Boolean(formik.touched.scaling && formik.errors.scaling)}
            fullWidth
            helperText={formik.touched.scaling && formik.errors.scaling}
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
            name="sustainability"
            label="How will this innovation be sustained in the next three years?"
            value={formik.values.sustainability}
            error={Boolean(
              formik.touched.sustainability && formik.errors.sustainability
            )}
            fullWidth
            helperText={
              formik.touched.sustainability && formik.errors.sustainability
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            multiline
            variant="outlined"
            my={2}
            rows={3}
          />
        </Grid>
      </Grid>
      <Button type="submit" variant="contained" color="primary" mt={3}>
        Save
      </Button>
    </form>
  );
};

const Innovation = ({ processLevelItemId, processLevelTypeId }) => {
  return (
    <Card mb={12}>
      <CardContent>
        <Grid container spacing={12}>
          <Grid item md={12}>
            <Typography variant="h3" gutterBottom display="inline">
              Innovation
            </Typography>
          </Grid>
          <Grid item md={12}>
            <InnovationForm
              processLevelItemId={processLevelItemId}
              processLevelTypeId={processLevelTypeId}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default Innovation;
