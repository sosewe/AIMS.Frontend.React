import React, { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { lookupItem, newLookupItem } from "../../api/lookup";
import { toast } from "react-toastify";
import { Guid } from "../../utils/guid";

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

const LookupItemForm = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const { data: lookupItemData } = useQuery(["lookup", id], lookupItem, {
    enabled: !!id,
  });
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

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Required"),
      alias: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        values.createDate = new Date();
        if (id) {
          values.id = id;
          values.updateDate = new Date();
        } else {
          values.id = new Guid().toString();
        }
        mutation.mutate(values);
        toast("Successfully Created LookupItem", {
          type: "success",
        });
        navigate("/lookup/lookupItem");
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  useEffect(() => {
    function setCurrentFormValues() {
      if (lookupItemData) {
        formik.setValues({
          name: lookupItemData.data.name,
          alias: lookupItemData.data.alias,
        });
      }
    }
    setCurrentFormValues();
  }, [lookupItemData]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card mb={6}>
        <CardContent>
          {formik.isSubmitting ? (
            <Box display="flex" justifyContent="center" my={6}>
              <CircularProgress />
            </Box>
          ) : (
            <>
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
                <Grid item md={6}>
                  <TextField
                    name="alias"
                    label="Alias"
                    value={formik.values.alias}
                    error={Boolean(formik.touched.alias && formik.errors.alias)}
                    fullWidth
                    helperText={formik.touched.alias && formik.errors.alias}
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
