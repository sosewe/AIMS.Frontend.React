import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
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
  MenuItem,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAggregateById, newAggregate } from "../../api/aggregate";
import { Guid } from "../../utils/guid";
import useKeyCloakAuth from "../../hooks/useKeyCloakAuth";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const NewAggregateForm = () => {
  let { id } = useParams();
  const user = useKeyCloakAuth();
  const navigate = useNavigate();
  const { isLoading, isError, data } = useQuery(
    ["getAggregateById", id],
    getAggregateById,
    {
      enabled: !!id,
    }
  );
  const mutation = useMutation({ mutationFn: newAggregate });
  const formik = useFormik({
    initialValues: { name: "", initials: "", description: "" },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Required"),
      initials: Yup.string().required("Required"),
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
        resetForm();
        toast("Successfully Created an Aggregate", {
          type: "success",
        });
        navigate("/indicator/aggregates");
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  useEffect(() => {
    function setCurrentFormValues() {
      if (!isLoading && !isError && data) {
        formik.setValues({
          name: data.data.name,
          initials: data.data.initials,
          description: data.data.description,
        });
      }
    }
    setCurrentFormValues();
  }, [isLoading, isError, data]);

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
                    NEW AGGREGATE
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
                    name="description"
                    label="Description"
                    required
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
                    variant="outlined"
                    my={2}
                  />
                </Grid>
              </Grid>

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

const NewAggregate = () => {
  return (
    <React.Fragment>
      <Helmet title="New Aggregate" />
      <Typography variant="h3" gutterBottom display="inline">
        New Aggregate
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/indicator/aggregates">
          New Aggregate
        </Link>
        <Typography>New Aggregate</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <NewAggregateForm />
    </React.Fragment>
  );
};
export default NewAggregate;
