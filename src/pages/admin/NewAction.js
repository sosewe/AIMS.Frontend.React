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
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Guid } from "../../utils/guid";
import { getAction, newAction } from "../../api/action";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const NewAction = () => {
  let { pageId, actionId } = useParams();
  const navigate = useNavigate();
  const mutation = useMutation({ mutationFn: newAction });
  const { isLoading, isError, data } = useQuery(
    ["getAction", actionId],
    getAction,
    {
      enabled: !!actionId,
    }
  );
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      values.createDate = new Date();
      values.pageId = pageId;
      setSubmitting(true);
      if (actionId) {
        values.id = actionId;
      } else {
        values.id = new Guid().toString();
      }
      try {
        await mutation.mutateAsync(values);
        toast("Successfully Created Action", {
          type: "success",
        });
        navigate("/admin/pages");
        resetForm();
      } catch (error) {
        toast(error.message, {
          type: "error",
        });
      }
    },
  });
  useEffect(() => {
    if (!isLoading && !isError) {
      formik.setValues({
        name: data.data.name,
      });
    }
  }, [isLoading, isError, data]);
  return (
    <React.Fragment>
      <Helmet title="New Action" />
      <Typography variant="h3" gutterBottom display="inline">
        New Action
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/admin/pages">
          Action
        </Link>
        <Typography>New Action</Typography>
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
                      NEW ACTION
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
                      helperText="Action Name e.g. new-entity, edit-entity"
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
export default NewAction;
