import React, { useEffect, useState, useCallback } from "react";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Grid,
  MenuItem,
  TextField as MuiTextField,
  Typography,
  Divider as MuiDivider,
  Box,
  CircularProgress,
} from "@mui/material";
import * as Yup from "yup";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Check, ChevronLeft } from "react-feather";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Guid } from "../../../../utils/guid";
import { getInnovationByMonitoringPeriod } from "../../../../api/innovation";
import { newInnovationMonitoringTechnicalReview } from "../../../../api/innovation-monitoring-technical-review";
import { getLookupMasterItemsByName } from "../../../../api/lookup";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const Divider = styled(MuiDivider)(spacing);

const initialValues = {
  innovationEffectiveness: "",
  innovationScalabiity: "",
};

const TechnicalReviewForm = (props) => {
  const [editId, setEditId] = useState();
  const id = props.innovationId;
  const geoFocusId = props.projectLocationId;
  const reportingFrequencyId = props.reportingPeriod;
  const reportingYearId = props.year;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: innovationMonitoring,
    isLoading: isLoadingInnovationMonitoring,
    isError: isErrorInnovationMonitoring,
  } = useQuery(
    [
      "getInnovationByMonitoringPeriod",
      id,
      geoFocusId,
      reportingFrequencyId,
      reportingYearId,
    ],
    getInnovationByMonitoringPeriod,
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
          id: editId ?? new Guid().toString(),
          innovationId: id,
          hasInnovationMetEffectivenessCriteria: values.innovationEffectiveness,
          canInnovationBeScaledUp: values.innovationScalabiity,
          reportingFrequencyId: reportingFrequencyId,
          reportingFrequency: "",
          implementationYearId: reportingYearId,
          implementationYear: "",
          administrativeUnitId: geoFocusId,
          createDate: new Date(),
        };
        await mutation.mutateAsync(saveTechnicalReview);

        toast("Successfully Updated Technical Review Monitoring", {
          type: "success",
        });
        await queryClient.invalidateQueries([
          "getInnovationMonitoringTechnicalReviewByInnovationId",
        ]);
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
      if (
        !isLoadingInnovationMonitoring &&
        innovationMonitoring &&
        innovationMonitoring.data
      ) {
        let data =
          innovationMonitoring.data.innovationTechnicalReviewAtClosures[0];
        formik.setValues({
          innovationEffectiveness: data.hasInnovationMetEffectivenessCriteria,
          innovationScalabiity: data.canInnovationBeScaledUp,
        });

        setEditId(data.id);
      }
    }
    setCurrentFormValues();
  }, [isLoadingInnovationMonitoring, innovationMonitoring]);

  const handleActionChange = useCallback();

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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              mt={3}
              ml={3}
            >
              <Check /> Save changes
            </Button>
          </Grid>
        </Grid>
      )}
    </form>
  );
};

const TechnicalReview = () => {
  let {
    processLevelItemId,
    processLevelTypeId,
    innovationId,
    projectLocationId,
    reportingPeriod,
    year,
  } = useParams();
  return (
    <React.Fragment>
      <Helmet title="New Innovation Monitoring" />
      <Typography variant="h5" gutterBottom display="inline">
        Technical Review
      </Typography>

      <Divider my={2} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <TechnicalReviewForm
                processLevelItemId={processLevelItemId}
                processLevelTypeId={processLevelTypeId}
                innovationId={innovationId}
                projectLocationId={projectLocationId}
                reportingPeriod={reportingPeriod}
                year={year}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default TechnicalReview;
