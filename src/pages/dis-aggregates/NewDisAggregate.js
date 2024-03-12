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
import { Guid } from "../../utils/guid";
import useKeyCloakAuth from "../../hooks/useKeyCloakAuth";
import { getDisaggregate, newDisAggregate } from "../../api/disaggregate";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const DisAggregateForm = () => {
  let { id } = useParams();
  const user = useKeyCloakAuth();
  const navigate = useNavigate();
  const { isLoading, isError, data } = useQuery(
    ["getDisaggregate", id],
    getDisaggregate,
    {
      enabled: !!id,
    }
  );
  const mutation = useMutation({ mutationFn: newDisAggregate });
  const formik = useFormik({
    initialValues: { name: "", initials: "", description: "", level: "" },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Required"),
      initials: Yup.string(),
      description: Yup.string(),
      level: Yup.number().required("Required"),
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
        toast("Successfully Created a DisAggregate", {
          type: "success",
        });
        navigate("/indicator/dis-aggregates");
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
          level: data.data.level ? data.data.level : "",
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
                    NEW DIS-AGGREGATE
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
                <Grid item md={12}>
                  <TextField
                    name="level"
                    label="Level"
                    select
                    value={formik.values.level}
                    error={Boolean(formik.touched.level && formik.errors.level)}
                    fullWidth
                    helperText={formik.touched.level && formik.errors.level}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled>Select Level</MenuItem>
                    <MenuItem key={1} value={1}>
                      1
                    </MenuItem>
                    <MenuItem key={2} value={2}>
                      2
                    </MenuItem>
                    <MenuItem key={3} value={3}>
                      3
                    </MenuItem>
                  </TextField>
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

const NewDisAggregate = () => {
  return (
    <React.Fragment>
      <Helmet title="New DisAggregate" />
      <Typography variant="h3" gutterBottom display="inline">
        New DisAggregate
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/indicator/dis-aggregates">
          New DisAggregate
        </Link>
        <Typography>New DisAggregate</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <DisAggregateForm />
    </React.Fragment>
  );
};
export default NewDisAggregate;
