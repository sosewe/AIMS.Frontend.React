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
import { useMutation, useQuery } from "@tanstack/react-query";
import { getLookupMasterItemsByName } from "../../api/lookup";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { getEntity, newAMREFEntity } from "../../api/amref-entity";
import { Guid } from "../../utils/guid";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const initialValues = {
  entityTypeId: "",
  name: "",
  description: "",
};

const NewEntityForm = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const { data: EntityData } = useQuery(["getEntity", id], getEntity, {
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
  const { data: entityTypesData, isLoading } = useQuery(
    ["entityTypes", "EntityType"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );
  const mutation = useMutation({ mutationFn: newAMREFEntity });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      entityTypeId: Yup.string().required("Required"),
      name: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      values.createDate = new Date();
      if (id) {
        values.id = id;
      } else {
        values.id = new Guid().toString();
      }
      try {
        await mutation.mutateAsync(values);
        toast("Successfully Created an Entity", {
          type: "success",
        });
        navigate("/settings/entities");
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });
  useEffect(() => {
    function setCurrentFormValues() {
      if (EntityData) {
        formik.setValues({
          entityTypeId: EntityData.data.entityTypeId,
          name: EntityData.data.name,
          description: EntityData.data.description,
        });
      }
    }
    setCurrentFormValues();
  }, [EntityData]);

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
                    NEW ENTITY
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={6}>
                <Grid item md={6}>
                  <TextField
                    name="entityTypeId"
                    label="Entity Type"
                    select
                    value={formik.values.entityTypeId}
                    error={Boolean(
                      formik.touched.entityTypeId && formik.errors.entityTypeId
                    )}
                    fullWidth
                    helperText={
                      formik.touched.entityTypeId && formik.errors.entityTypeId
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Entity Type
                    </MenuItem>
                    {!isLoading
                      ? entityTypesData.data.map((option) => (
                          <MenuItem
                            key={option.lookupItemId}
                            value={option.lookupItemId}
                          >
                            {option.lookupItemName}
                          </MenuItem>
                        ))
                      : []}
                  </TextField>
                </Grid>
              </Grid>
              <Grid container spacing={6}>
                <Grid item md={6}>
                  <TextField
                    name="name"
                    label="Name"
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
              <Grid container spacing={6}>
                <Grid item md={6}>
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

const NewEntity = () => {
  return (
    <React.Fragment>
      <Helmet title="New Entity" />
      <Typography variant="h3" gutterBottom display="inline">
        New Entity
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/settings/entities">
          Entities
        </Link>
        <Typography>New Entity</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <NewEntityForm />
    </React.Fragment>
  );
};
export default NewEntity;
