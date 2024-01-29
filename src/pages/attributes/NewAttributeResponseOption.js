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
  MenuItem,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { Helmet } from "react-helmet-async";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Guid } from "../../utils/guid";
import { toast } from "react-toastify";
import useKeyCloakAuth from "../../hooks/useKeyCloakAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createAttributeResponseOption,
  getAttributeResponseOptionById,
} from "../../api/attribute-response-option";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const NewAttributeResponseOptionForm = () => {
  const user = useKeyCloakAuth();
  let { attributeTypeId, id } = useParams();
  const navigate = useNavigate();
  const { isLoading, isError, data } = useQuery(
    ["getAttributeResponseOptionById", id],
    getAttributeResponseOptionById,
    {
      enabled: !!id,
    }
  );
  const mutation = useMutation({ mutationFn: createAttributeResponseOption });
  const formik = useFormik({
    initialValues: {
      responseOption: "",
    },
    validationSchema: Yup.object().shape({
      responseOption: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        values.createDate = new Date();
        values.userId = user.sub;
        values.attributeTypeId = attributeTypeId;
        if (id) {
          values.id = id;
        } else {
          values.id = new Guid().toString();
        }
        await mutation.mutateAsync(values);
        toast("Successfully Attribute Response Option", {
          type: "success",
        });
        navigate("/indicator/view-attribute/" + attributeTypeId);
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
          responseOption: data.data.responseOption,
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
                    NEW ATTRIBUTE RESPONSE OPTION
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={6}>
                <Grid item md={12}>
                  <TextField
                    name="responseOption"
                    label="Response Option"
                    value={formik.values.responseOption}
                    error={Boolean(
                      formik.touched.responseOption &&
                        formik.errors.responseOption
                    )}
                    fullWidth
                    helperText={
                      formik.touched.name && formik.errors.responseOption
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

const NewAttributeResponseOption = () => {
  return (
    <React.Fragment>
      <Helmet title="New Attribute Response Option" />
      <Typography variant="h3" gutterBottom display="inline">
        New Attribute Response Option
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/indicator/attributes-list">
          Attributes
        </Link>
        <Typography>New Attribute Response Option</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <NewAttributeResponseOptionForm />
    </React.Fragment>
  );
};
export default NewAttributeResponseOption;
