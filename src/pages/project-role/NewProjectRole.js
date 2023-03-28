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
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProjectRoleById, newProjectRole } from "../../api/project-role";
import { Guid } from "../../utils/guid";
import { Helmet } from "react-helmet-async";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const NewProjectRole = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const {
    data: ProjectRoleData,
    isLoading: isLoadingProjectRole,
    isError: isErrorProjectRole,
  } = useQuery(["getProjectRoleById", id], getProjectRoleById, {
    enabled: !!id,
  });
  const mutation = useMutation({ mutationFn: newProjectRole });
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        values.createDate = new Date();
        if (id) {
          values.id = id;
        } else {
          values.id = new Guid().toString();
        }
        await mutation.mutateAsync(values);
        navigate("/settings/project-roles");
      } catch (e) {
        toast(e.response.data, {
          type: "error",
        });
      }
    },
  });

  useEffect(() => {
    function setCurrentFormValues() {
      if (!isLoadingProjectRole && !isErrorProjectRole) {
        formik.setValues({
          name: ProjectRoleData.data.name,
          description: ProjectRoleData.data.description,
        });
      }
    }
    setCurrentFormValues();
  }, [ProjectRoleData, isLoadingProjectRole, isErrorProjectRole]);

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
                    PROJECT ROLE
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
const NewProjectRoleComponent = () => {
  return (
    <React.Fragment>
      <Helmet title="New Project Role" />
      <Typography variant="h3" gutterBottom display="inline">
        New Project Role
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/settings/project-roles">
          Project Roles
        </Link>
        <Typography>New Project Roles</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <NewProjectRole />
    </React.Fragment>
  );
};
export default NewProjectRoleComponent;
