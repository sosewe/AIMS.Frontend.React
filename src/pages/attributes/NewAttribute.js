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
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAMREFStaffList } from "../../api/lookup";
import { getAttributeDataTypes } from "../../api/attribute-data-type";
import { toast } from "react-toastify";
import {
  getAttributeTypeById,
  newAttributeType,
} from "../../api/attribute-type";
import useKeyCloakAuth from "../../hooks/useKeyCloakAuth";
import { Guid } from "../../utils/guid";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const NewAttributeForm = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const user = useKeyCloakAuth();
  const {
    isLoading: isLoadingAttributeDataTypes,
    isError: isErrorAttributeDataType,
    data: attributeDataTypeData,
  } = useQuery(["getAttributeDataTypes"], getAttributeDataTypes, {
    refetchOnWindowFocus: false,
    retry: 0,
  });
  const {
    isLoading: isLoadingAttributeType,
    isError: isErrorAttributeType,
    data: attributeTypeData,
  } = useQuery(["getAttributeTypeById", id], getAttributeTypeById, {
    enabled: !!id,
  });
  const mutation = useMutation({ mutationFn: newAttributeType });
  const formik = useFormik({
    initialValues: {
      name: "",
      attributeDataTypeId: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Required"),
      attributeDataTypeId: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        values.createDate = new Date();
        values.userId = user.sub;
        if (id) {
          values.id = id;
        } else {
          values.id = new Guid().toString();
        }
        await mutation.mutateAsync(values);
        toast("Successfully Attribute", {
          type: "success",
        });
        navigate("/indicator/attributes-list");
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  useEffect(() => {
    function setCurrentFormValues() {
      if (
        !isLoadingAttributeType &&
        !isErrorAttributeType &&
        attributeTypeData
      ) {
        formik.setValues({
          name: attributeTypeData.data.name,
          attributeDataTypeId: attributeTypeData.data.attributeDataTypeId,
        });
      }
    }
    setCurrentFormValues();
  }, [attributeTypeData, isErrorAttributeType, isLoadingAttributeType]);

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
                    NEW ATTRIBUTE BASIC INFORMATION
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
                    helperText={formik.touched.name && formik.errors.name}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
                <Grid item md={12}>
                  <TextField
                    name="attributeDataTypeId"
                    label="Attribute DataType"
                    select
                    value={formik.values.attributeDataTypeId}
                    error={Boolean(
                      formik.touched.attributeDataTypeId &&
                        formik.errors.attributeDataTypeId
                    )}
                    fullWidth
                    helperText={
                      formik.touched.attributeDataTypeId &&
                      formik.errors.attributeDataTypeId
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Attribute Datatype
                    </MenuItem>
                    {!isLoadingAttributeDataTypes && !isErrorAttributeDataType
                      ? attributeDataTypeData.data.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.dataType}
                          </MenuItem>
                        ))
                      : []}
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

const NewAttribute = () => {
  return (
    <React.Fragment>
      <Helmet title="New Attribute" />
      <Typography variant="h3" gutterBottom display="inline">
        New Attribute
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/indicator/attributes-list">
          Attributes
        </Link>
        <Typography>New Attribute</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <NewAttributeForm />
    </React.Fragment>
  );
};
export default NewAttribute;
