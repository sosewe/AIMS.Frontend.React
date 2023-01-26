import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Guid } from "../../../utils/guid";
import { toast } from "react-toastify";
import {
  Box,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  Stack,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { getProjectIndicators } from "../../../api/project";
import { getLookupMasterItemsByName } from "../../../api/lookup";
import { saveResultChainIndicator } from "../../../api/result-chain-indicator";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);
const TextField = styled(MuiTextField)(spacing);

const initialValuesIndicator = {
  indicatorId: "",
  indicatorOrderOfAppearance: "",
  indicatorTypeOfMeasure: "",
  indicatorTargetGroup: "",
  indicatorSourceOfInformation: "",
  indicatorReportingFrequency: "",
  indicatorBaselineValue: "",
  indicatorOverallTarget: "",
  indicatorDisaggregated: false,
  indicatorCumulative: false,
};

const AddIndicatorModal = ({ processLevelItemId, outcome, handleClick }) => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery(
    ["getProjectIndicators", processLevelItemId],
    getProjectIndicators
  );
  const {
    data: indicatorMeasuresData,
    isError: isErrorIndicatorMeasures,
    isLoading: isLoadingIndicatorMeasures,
  } = useQuery(
    ["IndicatorMeasure", "IndicatorMeasure"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );
  const {
    data: reportingFrequencyData,
    isError: isErrorReportingFrequency,
    isLoading: isLoadingReportingFrequency,
  } = useQuery(
    ["ReportingFrequency", "ReportingFrequency"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const mutation = useMutation({ mutationFn: saveResultChainIndicator });
  const formik = useFormik({
    initialValues: initialValuesIndicator,
    validationSchema: Yup.object().shape({
      indicatorId: Yup.string().required("Required"),
      indicatorOrderOfAppearance: Yup.number().required("Required"),
      indicatorTypeOfMeasure: Yup.string().required("Required"),
      indicatorTargetGroup: Yup.string().required("Required"),
      indicatorSourceOfInformation: Yup.string().required("Required"),
      indicatorReportingFrequency: Yup.string().required("Required"),
      indicatorBaselineValue: Yup.string().required("Required"),
      indicatorOverallTarget: Yup.string().required("Required"),
      indicatorDisaggregated: Yup.boolean().required("Required"),
      indicatorCumulative: Yup.boolean().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const resultChainIndicator = {
          id: new Guid().toString(),
          indicatorId: values.indicatorId,
          createDate: new Date(),
          resultChainId: outcome.id,
          indicatorMeasureId: values.indicatorTypeOfMeasure,
          baseline: values.indicatorBaselineValue,
          indicatorCumulativeId: values.indicatorCumulative,
          disaggregated: values.indicatorDisaggregated,
          order: values.indicatorOrderOfAppearance,
          overallTarget: values.indicatorOverallTarget,
          reportingFrequencyId: values.indicatorReportingFrequency,
          source: values.indicatorSourceOfInformation,
          targetGroup: values.indicatorTargetGroup,
        };
        await mutation.mutateAsync(resultChainIndicator);
        await queryClient.invalidateQueries(["getResultChainByObjectiveId"]);
        await queryClient.invalidateQueries(["getResultChainByOutcomeId"]);
        handleClick();
        toast("Successfully added Indicator Outcome", {
          type: "success",
        });
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card mb={6}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Indicator
          </Typography>
          <Typography variant="h5" gutterBottom>
            {!isLoading && !isError
              ? data.data.length + " indicators available"
              : "0 indicators available"}
          </Typography>
        </CardContent>
      </Card>
      <Card mb={12}>
        <CardContent>
          {formik.isSubmitting ? (
            <Box display="flex" justifyContent="center" my={6}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={6}>
                <Grid item md={12}>
                  <TextField
                    name="indicatorId"
                    label="Indicator"
                    select
                    required
                    value={formik.values.indicatorId}
                    error={Boolean(
                      formik.touched.indicatorId && formik.errors.indicatorId
                    )}
                    fullWidth
                    helperText={
                      formik.touched.indicatorId && formik.errors.indicatorId
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Indicator
                    </MenuItem>
                    {!isLoading && !isError
                      ? data.data.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.code}-{option.name}
                          </MenuItem>
                        ))
                      : []}
                  </TextField>
                </Grid>
                <Grid item md={6}>
                  <TextField
                    name="indicatorOrderOfAppearance"
                    label="Order Of Appearance"
                    required
                    value={formik.values.indicatorOrderOfAppearance}
                    error={Boolean(
                      formik.touched.indicatorOrderOfAppearance &&
                        formik.errors.indicatorOrderOfAppearance
                    )}
                    fullWidth
                    helperText={
                      formik.touched.indicatorOrderOfAppearance &&
                      formik.errors.indicatorOrderOfAppearance
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                    type="number"
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    name="indicatorTypeOfMeasure"
                    label="Type Of Measure"
                    select
                    required
                    value={formik.values.indicatorTypeOfMeasure}
                    error={Boolean(
                      formik.touched.indicatorTypeOfMeasure &&
                        formik.errors.indicatorTypeOfMeasure
                    )}
                    fullWidth
                    helperText={
                      formik.touched.indicatorTypeOfMeasure &&
                      formik.errors.indicatorTypeOfMeasure
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Type Of Measure
                    </MenuItem>
                    {!isLoadingIndicatorMeasures && !isErrorIndicatorMeasures
                      ? indicatorMeasuresData.data.map((option) => (
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
                <Grid item md={6}>
                  <TextField
                    name="indicatorTargetGroup"
                    label="Target Group"
                    required
                    value={formik.values.indicatorTargetGroup}
                    error={Boolean(
                      formik.touched.indicatorTargetGroup &&
                        formik.errors.indicatorTargetGroup
                    )}
                    fullWidth
                    helperText={
                      formik.touched.indicatorTargetGroup &&
                      formik.errors.indicatorTargetGroup
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    name="indicatorSourceOfInformation"
                    label="Source Of Information"
                    required
                    value={formik.values.indicatorSourceOfInformation}
                    error={Boolean(
                      formik.touched.indicatorSourceOfInformation &&
                        formik.errors.indicatorSourceOfInformation
                    )}
                    fullWidth
                    helperText={
                      formik.touched.indicatorSourceOfInformation &&
                      formik.errors.indicatorSourceOfInformation
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    name="indicatorReportingFrequency"
                    label="Reporting Frequency"
                    select
                    required
                    value={formik.values.indicatorReportingFrequency}
                    error={Boolean(
                      formik.touched.indicatorReportingFrequency &&
                        formik.errors.indicatorReportingFrequency
                    )}
                    fullWidth
                    helperText={
                      formik.touched.indicatorReportingFrequency &&
                      formik.errors.indicatorReportingFrequency
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Reporting Frequency
                    </MenuItem>
                    {!isLoadingReportingFrequency && !isErrorReportingFrequency
                      ? reportingFrequencyData.data.map((option) => (
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
                <Grid item md={6}>
                  <TextField
                    name="indicatorBaselineValue"
                    label="Baseline Value"
                    required
                    value={formik.values.indicatorBaselineValue}
                    error={Boolean(
                      formik.touched.indicatorBaselineValue &&
                        formik.errors.indicatorBaselineValue
                    )}
                    fullWidth
                    helperText={
                      formik.touched.indicatorBaselineValue &&
                      formik.errors.indicatorBaselineValue
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                    type="number"
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    name="indicatorOverallTarget"
                    label="Overall Target"
                    required
                    value={formik.values.indicatorOverallTarget}
                    error={Boolean(
                      formik.touched.indicatorOverallTarget &&
                        formik.errors.indicatorOverallTarget
                    )}
                    fullWidth
                    helperText={
                      formik.touched.indicatorOverallTarget &&
                      formik.errors.indicatorOverallTarget
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                    type="number"
                  />
                </Grid>
                <Grid item md={6}></Grid>
                <Grid item md={6}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formik.values.indicatorDisaggregated}
                          onChange={formik.handleChange}
                          name="indicatorDisaggregated"
                        />
                      }
                      label="Is this indicator Disaggregated?"
                    />
                  </FormGroup>
                </Grid>
                <Grid item md={6}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formik.values.indicatorCumulative}
                          onChange={formik.handleChange}
                          name="indicatorCumulative"
                        />
                      }
                      label="Cumulative?"
                    />
                  </FormGroup>
                </Grid>
              </Grid>
              <Stack direction="row" spacing={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  mt={3}
                >
                  Save
                </Button>
              </Stack>
            </>
          )}
        </CardContent>
      </Card>
    </form>
  );
};
export default AddIndicatorModal;
