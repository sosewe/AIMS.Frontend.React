import React, { useEffect } from "react";
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
  MenuItem,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createProgramme, getProgramme } from "../../api/programmes";
import { Guid } from "../../utils/guid";
import { toast } from "react-toastify";
import useKeyCloakAuth from "../../hooks/useKeyCloakAuth";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const NewProgrammeForm = () => {
  let { id } = useParams();
  const user = useKeyCloakAuth();
  const navigate = useNavigate();
  const { data: ProgrammeData } = useQuery(["getProgramme", id], getProgramme, {
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
  const mutation = useMutation({ mutationFn: createProgramme });
  const formik = useFormik({
    initialValues: {
      name: "",
      initials: "",
      code: "",
      description: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Required"),
      initials: Yup.string().required("Required"),
      code: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);
      values.createDate = new Date();
      values.userId = user.sub;
      if (id) {
        values.id = id;
      } else {
        values.id = new Guid().toString();
      }
      try {
        await mutation.mutateAsync(values);
        toast("Successfully Created a Programme", {
          type: "success",
        });
        resetForm();
        navigate("/programme/programmes");
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  useEffect(() => {
    function setCurrentFormValues() {
      if (ProgrammeData) {
        formik.setValues({
          name: ProgrammeData.data.name,
          initials: ProgrammeData.data.initials,
          code: ProgrammeData.data.code,
          description: ProgrammeData.data.description,
        });
      }
    }
    setCurrentFormValues();
  }, [ProgrammeData]);

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
                    STRATEGIC OBJECTIVE BASIC INFORMATION
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={6}>
                <Grid item md={12}>
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
                <Grid item md={12}>
                  <TextField
                    name="initials"
                    label="Initials"
                    required
                    value={formik.values.initials}
                    error={Boolean(
                      formik.touched.initials && formik.errors.initials
                    )}
                    fullWidth
                    helperText={
                      formik.touched.initials && formik.errors.initials
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
                <Grid item md={12}>
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
                Save changes
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </form>
  );
};
const NewProgramme = () => {
  return (
    <React.Fragment>
      <Helmet title="New Programme" />
      <Typography variant="h3" gutterBottom display="inline">
        New Strategic Objective
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/programme/programmes">
          Strategic Objective
        </Link>
        <Typography>New Strategic Objective</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <NewProgrammeForm />
    </React.Fragment>
  );
};
export default NewProgramme;
