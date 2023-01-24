import React, { useEffect } from "react";
import styled from "@emotion/styled";
import {
  Box,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CircularProgress,
  Grid,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getLookupMasterById, saveLookupMaster } from "../../api/lookup-master";
import { toast } from "react-toastify";
import { Guid } from "../../utils/guid";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const initialValues = {
  name: "",
  alias: "",
};

const NewLookupMaster = () => {
  let { id } = useParams();
  const navigate = useNavigate();

  const {
    data: lookupMasterData,
    isError: isErrorLookupMaster,
    isLoading: isLoadingLookupMaster,
  } = useQuery(["getLookupMasterById", id], getLookupMasterById, {
    enabled: !!id,
  });
  const mutation = useMutation({ mutationFn: saveLookupMaster });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Required"),
      alias: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        if (id) {
          values.id = id;
        } else {
          values.id = new Guid().toString();
        }
        await mutation.mutateAsync(values);
        toast("Successfully Created an Lookup Master", {
          type: "success",
        });
        navigate("/lookup/lookupMasters");
      } catch (e) {
        toast(e.response.data, {
          type: "error",
        });
      }
    },
  });

  useEffect(() => {
    function setCurrentFormValues() {
      if (lookupMasterData && !isErrorLookupMaster && !isLoadingLookupMaster) {
        formik.setValues({
          name: lookupMasterData.data.name,
          alias: lookupMasterData.data.alias,
        });
      }
    }
    setCurrentFormValues();
  }, [lookupMasterData, isErrorLookupMaster, isLoadingLookupMaster]);

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
                    LOOKUP MASTER
                  </Typography>
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
export default NewLookupMaster;
