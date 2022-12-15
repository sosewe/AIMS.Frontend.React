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
import { getDonorById, newDonor } from "../../api/donor";
import { Guid } from "../../utils/guid";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const initialValues = {
  donorName: "",
  donorInitial: "",
  donorType: "",
};

const NewDonorForm = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const { data: DonorData } = useQuery(["getDonorById", id], getDonorById, {
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
  const { data: donorTypesData, isLoading } = useQuery(
    ["donorTypes", "DonorType"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );
  const mutation = useMutation({ mutationFn: newDonor });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      donorName: Yup.string().required("Required"),
      donorInitial: Yup.string().required("Required"),
      donorType: Yup.string().required("Required"),
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
        toast("Successfully Created a Donor", {
          type: "success",
        });
        navigate("/settings/donors");
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });
  useEffect(() => {
    function setCurrentFormValues() {
      if (DonorData) {
        formik.setValues({
          donorName: DonorData.data.donorName,
          donorInitial: DonorData.data.donorInitial,
          donorType: DonorData.data.donorType,
        });
      }
    }
    setCurrentFormValues();
  }, [DonorData]);

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
                    NEW DONOR
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={6}>
                <Grid item md={4}>
                  <TextField
                    name="donorName"
                    label="Donor Name"
                    required
                    value={formik.values.donorName}
                    error={Boolean(
                      formik.touched.donorName && formik.errors.donorName
                    )}
                    fullWidth
                    helperText={
                      formik.touched.donorName && formik.errors.donorName
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={6}>
                <Grid item md={4}>
                  <TextField
                    name="donorInitial"
                    label="Donor Initial"
                    required
                    value={formik.values.donorInitial}
                    error={Boolean(
                      formik.touched.donorInitial && formik.errors.donorInitial
                    )}
                    fullWidth
                    helperText={
                      formik.touched.donorInitial && formik.errors.donorInitial
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={6}>
                <Grid item md={4}>
                  <TextField
                    name="donorType"
                    label="Donor Type"
                    select
                    value={formik.values.donorType}
                    error={Boolean(
                      formik.touched.donorType && formik.errors.donorType
                    )}
                    fullWidth
                    helperText={
                      formik.touched.donorType && formik.errors.donorType
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Donor Type
                    </MenuItem>
                    {!isLoading
                      ? donorTypesData.data.map((option) => (
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

const NewDonor = () => {
  return (
    <React.Fragment>
      <Helmet title="New Donor" />
      <Typography variant="h3" gutterBottom display="inline">
        New Donor
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/settings/donors">
          Donors
        </Link>
        <Typography>New Donor</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <NewDonorForm />
    </React.Fragment>
  );
};
export default NewDonor;
