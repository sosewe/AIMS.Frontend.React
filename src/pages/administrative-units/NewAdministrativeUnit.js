import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  Box,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CircularProgress,
  Grid,
  MenuItem,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Guid } from "../../utils/guid";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAdministrativeUnitById,
  newAdministrativeUnit,
} from "../../api/administrative-unit";
import { useNavigate, useParams } from "react-router-dom";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const initialValues = {
  adminUnit: "",
  hasParent: "",
  parent: "",
  level: "",
};

const NewAdministrativeUnit = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const [isParentEnabled, setIsParentEnabled] = useState(true);
  const { data, isError, isLoading } = useQuery(
    ["getAdministrativeUnitById", id],
    getAdministrativeUnitById,
    { enabled: !!id }
  );
  const mutation = useMutation({ mutationFn: newAdministrativeUnit });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      adminUnit: Yup.string().required("Required"),
      hasParent: Yup.string().required("Required"),
      parent: Yup.string().when("hasParent", {
        is: (val) => val && val === "yes",
        then: Yup.string().required("Must enter Parent"),
      }),
      level: Yup.number().required("Required"),
    }),
    onSubmit: async (values) => {
      values.createDate = new Date();
      values.relationship = values.hasParent === "yes" ? true : false;
      if (id) {
        values.id = id;
      } else {
        values.id = new Guid().toString();
      }
      try {
        await mutation.mutateAsync(values);
        toast("Successfully Created an Administrative Unit", {
          type: "success",
        });
        navigate("/settings/administrative-units");
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  useEffect(() => {
    function setCurrentFormValues() {
      if (data && !isLoading && !isError) {
        formik.setValues({
          adminUnit: data.data.adminUnit,
          hasParent: data.data.relationship ? "yes" : "no",
          parent: data.data.parent,
          level: data.data.level,
        });
      }
    }
    setCurrentFormValues();
  }, [data, isError, isLoading]);

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
                    NEW ADMINISTRATIVE UNIT
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={6}>
                <Grid item md={3}>
                  <TextField
                    name="adminUnit"
                    label="Admin Unit"
                    value={formik.values.adminUnit}
                    error={Boolean(
                      formik.touched.adminUnit && formik.errors.adminUnit
                    )}
                    fullWidth
                    helperText={
                      formik.touched.adminUnit && formik.errors.adminUnit
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
                <Grid item md={3}>
                  <TextField
                    name="hasParent"
                    label="Has Parent?"
                    select
                    value={formik.values.hasParent}
                    error={Boolean(
                      formik.touched.hasParent && formik.errors.hasParent
                    )}
                    fullWidth
                    helperText={
                      formik.touched.hasParent && formik.errors.hasParent
                    }
                    onBlur={formik.handleBlur}
                    onChange={(e) => {
                      formik.handleChange(e);
                      if (e.target.value === "yes") {
                        setIsParentEnabled(true);
                      } else {
                        setIsParentEnabled(false);
                      }
                    }}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Has Parent?
                    </MenuItem>
                    <MenuItem key="yes" value="yes">
                      Yes
                    </MenuItem>
                    <MenuItem key="no" value="no">
                      No
                    </MenuItem>
                  </TextField>
                </Grid>
                <Grid item md={3}>
                  <TextField
                    name="parent"
                    label="Parent"
                    value={formik.values.parent}
                    error={Boolean(
                      formik.touched.parent && formik.errors.parent
                    )}
                    disabled={!isParentEnabled}
                    fullWidth
                    helperText={formik.touched.parent && formik.errors.parent}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
                <Grid item md={3}>
                  <TextField
                    name="level"
                    label="Level"
                    value={formik.values.level}
                    error={Boolean(formik.touched.level && formik.errors.level)}
                    fullWidth
                    helperText={formik.touched.level && formik.errors.level}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                    type="number"
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

export default NewAdministrativeUnit;
