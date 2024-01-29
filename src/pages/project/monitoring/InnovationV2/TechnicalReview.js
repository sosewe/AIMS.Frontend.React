import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  TextField as MuiTextField,
  Autocomplete as MuiAutocomplete,
  Typography,
  Link,
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Box,
  CircularProgress,
  InputLabel,
  FormControl,
  Select,
  OutlinedInput,
  Stack,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import * as Yup from "yup";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Check, Trash as TrashIcon } from "react-feather";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Guid } from "../../../../utils/guid";
import {
  newInnovationMonitoringTechnicalReview,
  getInnovationMonitoringTechnicalReviewByInnovationId,
  deleteInnovationMonitoringTechnicalReview,
} from "../../../../api/innovation-monitoring-technical-review";
import { getLookupMasterItemsByName } from "../../../../api/lookup";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Autocomplete = styled(MuiAutocomplete)(spacing);
const Button = styled(MuiButton)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const Divider = styled(MuiDivider)(spacing);

const initialValues = {
  innovationEffectiveness: "",
  innovationScalabiity: "",
};

const TechnicalReviewForm = ({ id }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: TechnicalReviewData, isLoading: isLoadingTechnicalReviewData } =
    useQuery(
      ["getInnovationMonitoringTechnicalReviewByInnovationId", id],
      getInnovationMonitoringTechnicalReviewByInnovationId,
      { enabled: !!id }
    );

  const { isLoading: isLoadingBoolean, data: booleanData } = useQuery(
    ["yesNo", "YesNo"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const mutation = useMutation({
    mutationFn: newInnovationMonitoringTechnicalReview,
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      innovationEffectiveness: Yup.string().required("Required"),
      innovationScalabiity: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const saveTechnicalReview = {
          id: id ? id : new Guid().toString(),
          createDate: new Date(),
          innovationId: id,
          hasInnovationMetEffectivenessCriteria: values.innovationEffectiveness,
          canInnovationBeScaledUp: values.innovationScalabiity,
        };
        await mutation.mutateAsync(saveTechnicalReview);

        toast("Successfully Updated Technical Review", {
          type: "success",
        });
        await queryClient.invalidateQueries([
          "getInnovationMonitoringTechnicalReviewByInnovationId",
        ]);
        navigate(`/project/monitoring/innovation-monitoring-detail/${id}`);
      } catch (error) {
        console.log(error);
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  useEffect(() => {
    function setCurrentFormValues() {
      if (!isLoadingBoolean && !isLoadingTechnicalReviewData) {
        formik.setValues({
          innovationEffectiveness:
            TechnicalReviewData.data.hasInnovationMetEffectivenessCriteria,
          innovationScalabiity:
            TechnicalReviewData.data.canInnovationBeScaledUp,
        });
      }
    }
    setCurrentFormValues();
  }, [isLoadingTechnicalReviewData, isLoadingBoolean, TechnicalReviewData]);

  return (
    <form onSubmit={formik.handleSubmit}>
      {formik.isSubmitting ? (
        <Box display="flex" justifyContent="center" my={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container item spacing={2}>
          <Grid container spacing={3}>
            <Grid item md={12}>
              <TextField
                name="innovationEffectiveness"
                label="Has this innovation met its effectiveness criteria successfully (metrics)?"
                select
                value={formik.values.innovationEffectiveness}
                error={Boolean(
                  formik.touched.innovationEffectiveness &&
                    formik.errors.innovationEffectiveness
                )}
                fullWidth
                helperText={
                  formik.touched.innovationEffectiveness &&
                  formik.errors.innovationEffectiveness
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Select
                </MenuItem>
                {!isLoadingBoolean
                  ? booleanData.data.map((option) => (
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

            <Grid item md={12}>
              <TextField
                name="innovationScalabiity"
                label="Based on the risks and mitigation and performance of indicators, can this innovation be scaled up?"
                select
                value={formik.values.innovationScalabiity}
                error={Boolean(
                  formik.touched.innovationScalabiity &&
                    formik.errors.innovationScalabiity
                )}
                fullWidth
                helperText={
                  formik.touched.innovationScalabiity &&
                  formik.errors.innovationScalabiity
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Select
                </MenuItem>
                {!isLoadingBoolean
                  ? booleanData.data.map((option) => (
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

          <Grid item mt={5} md={12}>
            <Button type="submit" variant="contained" color="primary" mt={3}>
              <Check /> Save changes
            </Button>
          </Grid>
        </Grid>
      )}
    </form>
  );
};

const TechnicalReview = () => {
  let { id } = useParams();
  return (
    <React.Fragment>
      <Helmet title="New Innovation Monitoring" />
      <Typography variant="h3" gutterBottom display="inline">
        Technical Review
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link>Project Monitoring</Link>
        <Typography>Technical Review</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <TechnicalReviewForm id={id} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default TechnicalReview;
