import React from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CircularProgress,
  Divider as MuiDivider,
  Grid,
  Link,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Guid } from "../../utils/guid";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { newModule } from "../../api/modules";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const NewModule = () => {
  const navigate = useNavigate();
  const mutation = useMutation({ mutationFn: newModule });
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      values.createDate = new Date();
      setSubmitting(true);
      // if (id) {
      //   values.id = id;
      // } else {
      //   values.id = new Guid().toString();
      // }
      try {
        await mutation.mutateAsync(values);
        toast("Successfully Created Module", {
          type: "success",
        });
        navigate("/admin/modules");
        resetForm();
      } catch (error) {
        toast(error.message, {
          type: "error",
        });
      }
    },
  });
  return (
    <React.Fragment>
      <Helmet title="New Module" />
      <Typography variant="h3" gutterBottom display="inline">
        New Module
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/admin/modules">
          Module
        </Link>
        <Typography>New Module</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <form onSubmit={formik.handleSubmit}>
        <Card mb={12}>
          <CardContent>
            {formik.isSubmitting ? (
              <Box display="flex" justifyContent="center" my={6}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Grid container spacing={12}>
                  <Grid item md={12}>
                    <Typography variant="h3" gutterBottom display="inline">
                      NEW MODULE
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={12}>
                    <TextField
                      name="name"
                      label="Name"
                      value={formik.values.name}
                      error={Boolean(formik.touched.name && formik.errors.name)}
                      fullWidth
                      helperText="Module Name e.g. Settings, Lookup"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      variant="outlined"
                      my={2}
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  mt={3}
                >
                  Save changes
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </form>
    </React.Fragment>
  );
};
export default NewModule;
