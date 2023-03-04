import React from "react";
import styled from "@emotion/styled";
import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  Grid,
  MenuItem,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getAMREFStaffList } from "../../../../api/lookup";
import { DatePicker } from "@mui/x-date-pickers";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);

const initialValues = {
  title: "",
  dateOfEntry: "",
  duration: "",
  staffNameId: "",
  proposedSolution: "",
  targetBeneficiary: "",
  difference: "",
  scaling: "",
  sustainability: "",
};
const InnovationForm = () => {
  const {
    isLoading: isLoadingStaffList,
    isError: isErrorStaffList,
    data: staffListData,
  } = useQuery(["staffList"], getAMREFStaffList, {
    refetchOnWindowFocus: false,
    retry: 0,
  });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      title: Yup.string().required("Required"),
      dateOfEntry: Yup.date().required("Required"),
      duration: Yup.date().required("Required"),
      staffNameId: Yup.string().required("Required"),
      proposedSolution: Yup.string().required("Required"),
      targetBeneficiary: Yup.string().required("Required"),
      difference: Yup.string().required("Required"),
      scaling: Yup.string().required("Required"),
      sustainability: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
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
        <Grid item md={4}>
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
            required
            variant="outlined"
            my={2}
          />
        </Grid>
        <Grid item md={4}>
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
        </Grid>
        <Grid item md={4}>
          {/*<DateRangePicker*/}
          {/*  label="Duration"*/}
          {/*  value={formik.values.duration}*/}
          {/*  onChange={(value) => formik.setFieldValue("duration", value, true)}*/}
          {/*  renderInput={(params) => (*/}
          {/*    <TextField*/}
          {/*      error={Boolean(*/}
          {/*        formik.touched.duration && formik.errors.duration*/}
          {/*      )}*/}
          {/*      helperText={formik.touched.duration && formik.errors.duration}*/}
          {/*      margin="normal"*/}
          {/*      name="duration"*/}
          {/*      variant="outlined"*/}
          {/*      fullWidth*/}
          {/*      my={2}*/}
          {/*      {...params}*/}
          {/*    />*/}
          {/*  )}*/}
          {/*/>*/}
        </Grid>
        <Grid item md={4}>
          <TextField
            name="staffNameId"
            label="Staff Name"
            select
            required
            value={formik.values.staffNameId}
            error={Boolean(
              formik.touched.staffNameId && formik.errors.staffNameId
            )}
            fullWidth
            helperText={formik.touched.staffNameId && formik.errors.staffNameId}
            onBlur={formik.handleBlur}
            onChange={(e) => {
              formik.handleChange(e);
            }}
            variant="outlined"
            my={2}
          >
            <MenuItem disabled value="">
              Select Staff Name
            </MenuItem>
            {!isLoadingStaffList && !isErrorStaffList
              ? staffListData.data.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.firstName} {option.lastName}
                  </MenuItem>
                ))
              : []}
          </TextField>
        </Grid>
        <Grid item md={6}>
          <TextField
            name="proposedSolution"
            label="Proposed Solution"
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
            required
            variant="outlined"
            my={2}
          />
        </Grid>
        <Grid item md={6}>
          <TextField
            name="targetBeneficiary"
            label="Target Beneficiary"
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
            required
            variant="outlined"
            my={2}
          />
        </Grid>
        <Grid item md={6}>
          <TextField
            name="difference"
            label="Difference"
            value={formik.values.difference}
            error={Boolean(
              formik.touched.difference && formik.errors.difference
            )}
            fullWidth
            helperText={formik.touched.difference && formik.errors.difference}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            multiline
            required
            variant="outlined"
            my={2}
          />
        </Grid>
        <Grid item md={6}>
          <TextField
            name="scaling"
            label="Scaling"
            value={formik.values.scaling}
            error={Boolean(formik.touched.scaling && formik.errors.scaling)}
            fullWidth
            helperText={formik.touched.scaling && formik.errors.scaling}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            multiline
            required
            variant="outlined"
            my={2}
          />
        </Grid>
        <Grid item md={6}>
          <TextField
            name="sustainability"
            label="Sustainability"
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
            required
            variant="outlined"
            my={2}
          />
        </Grid>
      </Grid>
    </form>
  );
};

const Innovation = () => {
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
            <InnovationForm />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default Innovation;
