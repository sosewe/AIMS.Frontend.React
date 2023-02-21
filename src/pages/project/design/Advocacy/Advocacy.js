import React from "react";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Grid,
  MenuItem,
  Paper as MuiPaper,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import { getAMREFStaffList } from "../../../../api/lookup";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const Paper = styled(MuiPaper)(spacing);

const initialValues = {
  title: "",
  staffNameId: "",
  beneficiary: "",
  advocacyNeed: "",
  expectedResult: "",
};
const AdvocacyForm = () => {
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
      staffNameId: Yup.string().required("Required"),
      beneficiary: Yup.string().required("Required"),
      advocacyNeed: Yup.string().required("Required"),
      expectedResult: Yup.string().required("Required"),
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
        <Grid item md={6}>
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
        <Grid item md={6}>
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
            name="beneficiary"
            label="Beneficiary"
            value={formik.values.beneficiary}
            error={Boolean(
              formik.touched.beneficiary && formik.errors.beneficiary
            )}
            fullWidth
            helperText={formik.touched.beneficiary && formik.errors.beneficiary}
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
            name="advocacyNeed"
            label="Advocacy Need"
            value={formik.values.advocacyNeed}
            error={Boolean(
              formik.touched.advocacyNeed && formik.errors.advocacyNeed
            )}
            fullWidth
            helperText={
              formik.touched.advocacyNeed && formik.errors.advocacyNeed
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
            name="expectedResult"
            label="expectedResult"
            value={formik.values.expectedResult}
            error={Boolean(
              formik.touched.expectedResult && formik.errors.expectedResult
            )}
            fullWidth
            helperText={
              formik.touched.expectedResult && formik.errors.expectedResult
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

const Advocacy = () => {
  return (
    <Card mb={12}>
      <CardContent>
        <Grid container spacing={12}>
          <Grid item md={12}>
            <Typography variant="h3" gutterBottom display="inline">
              Advocacy
            </Typography>
          </Grid>
          <Grid item md={12}>
            <AdvocacyForm />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default Advocacy;
