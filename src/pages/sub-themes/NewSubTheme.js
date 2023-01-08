import React, { useEffect } from "react";
import styled from "@emotion/styled";
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
import { spacing } from "@mui/system";
import { Helmet } from "react-helmet-async";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { getSubTheme, saveSubTheme } from "../../api/sub-theme";
import { Check } from "react-feather";
import { Guid } from "../../utils/guid";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const initialValues = {
  name: "",
  initial: "",
  code: "",
  description: "",
};

const NewSubThemeForm = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const { data: SubThemeData } = useQuery(["getSubTheme", id], getSubTheme, {
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
  const mutation = useMutation({ mutationFn: saveSubTheme });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Required"),
      initial: Yup.string().required("Required"),
      code: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      values.createDate = new Date();
      if (id) {
        values.id = id;
      } else {
        values.id = new Guid().toString();
      }
      try {
        await mutation.mutateAsync(values);
        toast("Successfully Created an Sub Theme", {
          type: "success",
        });
        navigate("/programme/sub-themes");
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });
  useEffect(() => {
    function setCurrentFormValues() {
      if (SubThemeData) {
        formik.setValues({
          name: SubThemeData.data.name,
          initial: SubThemeData.data.initial,
          description: SubThemeData.data.description,
          code: SubThemeData.data.code,
        });
      }
    }
    setCurrentFormValues();
  }, [SubThemeData]);

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
              <Grid container spacing={12}>
                <Grid item md={12}>
                  <Typography variant="h3" gutterBottom display="inline">
                    SUB THEME
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item md={6}>
                  <TextField
                    name="name"
                    label="Name"
                    required
                    value={formik.values.name}
                    error={Boolean(formik.touched.name && formik.errors.name)}
                    fullWidth
                    helperText={formik.touched.name && formik.errors.name}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item md={6}>
                  <TextField
                    name="initial"
                    label="Initials"
                    required
                    value={formik.values.initial}
                    error={Boolean(
                      formik.touched.initial && formik.errors.initial
                    )}
                    fullWidth
                    helperText={formik.touched.initial && formik.errors.initial}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item md={6}>
                  <TextField
                    name="code"
                    label="Code"
                    required
                    value={formik.values.code}
                    error={Boolean(formik.touched.code && formik.errors.code)}
                    fullWidth
                    helperText={formik.touched.code && formik.errors.code}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
              </Grid>
              <TextField
                name="description"
                label="Description"
                value={formik.values.description}
                error={Boolean(
                  formik.touched.description && formik.errors.description
                )}
                fullWidth
                helperText={
                  formik.touched.description && formik.errors.description
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                multiline
                required
                variant="outlined"
                rows={3}
                my={2}
              />
              <Button type="submit" variant="contained" color="primary" mt={3}>
                <Check /> Save changes
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </form>
  );
};
const NewSubTheme = () => {
  return (
    <React.Fragment>
      <Helmet title="New Sub Theme" />
      <Typography variant="h3" gutterBottom display="inline">
        New Sub Theme
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/programme/sub-themes">
          Sub Theme
        </Link>
        <Typography>New Sub Theme</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <NewSubThemeForm />
    </React.Fragment>
  );
};
export default NewSubTheme;
