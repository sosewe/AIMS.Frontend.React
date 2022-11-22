import React from "react";
import { useMutation, useQuery } from "react-query";
import { Helmet } from "react-helmet-async";
import styled from "@emotion/styled";
import {
  // Alert as MuiAlert,
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
import { NavLink, useParams } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { lookupItem, newLookupItem } from "../../api/lookup";
import { toast } from "react-toastify";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const CardContent = styled(MuiCardContent)(spacing);

// const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);

const Button = styled(MuiButton)(spacing);

const initialValues = {
  name: "",
  alias: "",
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  alias: Yup.string().required("Required"),
});

const LookupItemForm = () => {
  let { id } = useParams();
  console.log(id);
  // useQuery("lookupItem", lookupItem(id), { enabled: !!id });
  const { isIdle, data: lookupItemData } = useQuery(
    ["lookup", id],
    lookupItem,
    {
      enabled: !!id,
    }
  );
  const mutation = useMutation(newLookupItem, {
    onSuccess: () => {
      toast("New Lookup Item Created Successfully!", {
        type: "success",
      });
    },
    onError: (error) => {
      toast(error.response.data, {
        type: "error",
      });
    },
  });

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    values.createDate = new Date();
    mutation.mutate(values);
    resetForm();
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => {
        return (
          <Card mb={6}>
            <CardContent>
              {isSubmitting ? (
                <Box display="flex" justifyContent="center" my={6}>
                  <CircularProgress />
                </Box>
              ) : (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={6}>
                    <Grid item md={6}>
                      <TextField
                        name="name"
                        label="Name"
                        value={values.name}
                        error={Boolean(touched.name && errors.name)}
                        fullWidth
                        helperText={touched.name && errors.name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        my={2}
                      />
                    </Grid>
                    <Grid item md={6}>
                      <TextField
                        name="alias"
                        label="Alias"
                        value={values.alias}
                        error={Boolean(touched.alias && errors.alias)}
                        fullWidth
                        helperText={touched.alias && errors.alias}
                        onBlur={handleBlur}
                        onChange={handleChange}
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
                </form>
              )}
            </CardContent>
          </Card>
        );
      }}
    </Formik>
  );
};

const NewLookupItem = () => {
  return (
    <React.Fragment>
      <Helmet title="New Lookup Item" />
      <Typography variant="h3" gutterBottom display="inline">
        New Lookup Item
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/lookup/lookupItem">
          Lookup
        </Link>
        <Typography>New Lookup Item</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <LookupItemForm />
    </React.Fragment>
  );
};
export default NewLookupItem;
