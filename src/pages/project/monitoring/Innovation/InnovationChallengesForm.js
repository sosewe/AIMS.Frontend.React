import React from "react";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Grid,
  TextField as MuiTextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { spacing } from "@mui/system";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const initialValues = {
  challenge: "",
};

const InnovationChallengesForm = ({ handleClick }) => {
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      challenge: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        handleClick(values);
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
          <Grid container spacing={2}>
            <Grid item md={12}>
              <TextField
                name="challenge"
                label="Challenge"
                value={formik.values.challenge}
                error={Boolean(
                  formik.touched.challenge && formik.errors.challenge
                )}
                fullWidth
                helperText={formik.touched.challenge && formik.errors.challenge}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item md={3}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                mt={3}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};
export default InnovationChallengesForm;
