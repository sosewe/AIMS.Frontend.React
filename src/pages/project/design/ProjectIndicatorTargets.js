import React from "react";
import styled from "@emotion/styled";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Grid,
  Link,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { Helmet } from "react-helmet-async";
import { NavLink, useParams } from "react-router-dom";
import { Formik } from "formik";
import { useQuery } from "@tanstack/react-query";
import { getGeographicalFocusByAdminUnitIdAndProcessLevelItemId } from "../../../api/location";
import { lookupItem } from "../../../api/lookup";
import { getResultChainIndicatorByProjectId } from "../../../api/result-chain-indicator";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);
const TextField = styled(MuiTextField)(spacing);

const ResultIndicatorTargetsForm = ({ resultChainIndicator }) => {
  const initialValues = {};
  for (let i = 1; i <= 12; i++) {
    initialValues[resultChainIndicator.id + "/" + i.toString()] = "";
  }
  console.log(initialValues);
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={{}}
      onSubmit={(values) => console.log(values)}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit}>
          <Grid item md={12}>
            <Grid
              container
              direction="row"
              justifyContent="left"
              alignItems="left"
            >
              <Grid item md={1}>
                <TextField
                  // name={resultChainIndicator.id + "/1"}
                  // value={values.resultChainIndicator.id + "/1"}
                  // error={Boolean(
                  //   touched.resultChainIndicator.id + "/1" &&
                  //     errors.resultChainIndicator.id + "/1"
                  // )}
                  fullWidth
                  // helperText={
                  //   touched.resultChainIndicator.id + "/1" &&
                  //   errors.resultChainIndicator.id + "/1"
                  // }
                  onBlur={handleBlur}
                  onChange={handleChange}
                  variant="outlined"
                  my={2}
                />
              </Grid>
              <Grid item md={1}>
                <TextField
                  // name={resultChainIndicator.id + "/1"}
                  // value={values.resultChainIndicator.id + "/1"}
                  // error={Boolean(
                  //   touched.resultChainIndicator.id + "/1" &&
                  //     errors.resultChainIndicator.id + "/1"
                  // )}
                  fullWidth
                  // helperText={
                  //   touched.resultChainIndicator.id + "/1" &&
                  //   errors.resultChainIndicator.id + "/1"
                  // }
                  onBlur={handleBlur}
                  onChange={handleChange}
                  variant="outlined"
                  my={2}
                />
              </Grid>
              <Grid item md={1}>
                <TextField
                  // name={resultChainIndicator.id + "/1"}
                  // value={values.resultChainIndicator.id + "/1"}
                  // error={Boolean(
                  //   touched.resultChainIndicator.id + "/1" &&
                  //     errors.resultChainIndicator.id + "/1"
                  // )}
                  fullWidth
                  // helperText={
                  //   touched.resultChainIndicator.id + "/1" &&
                  //   errors.resultChainIndicator.id + "/1"
                  // }
                  onBlur={handleBlur}
                  onChange={handleChange}
                  variant="outlined"
                  my={2}
                />
              </Grid>
              <Grid item md={1}>
                <TextField
                  // name={resultChainIndicator.id + "/1"}
                  // value={values.resultChainIndicator.id + "/1"}
                  // error={Boolean(
                  //   touched.resultChainIndicator.id + "/1" &&
                  //     errors.resultChainIndicator.id + "/1"
                  // )}
                  fullWidth
                  // helperText={
                  //   touched.resultChainIndicator.id + "/1" &&
                  //   errors.resultChainIndicator.id + "/1"
                  // }
                  onBlur={handleBlur}
                  onChange={handleChange}
                  variant="outlined"
                  my={2}
                />
              </Grid>
              <Grid item md={1}>
                <TextField
                  // name={resultChainIndicator.id + "/1"}
                  // value={values.resultChainIndicator.id + "/1"}
                  // error={Boolean(
                  //   touched.resultChainIndicator.id + "/1" &&
                  //     errors.resultChainIndicator.id + "/1"
                  // )}
                  fullWidth
                  // helperText={
                  //   touched.resultChainIndicator.id + "/1" &&
                  //   errors.resultChainIndicator.id + "/1"
                  // }
                  onBlur={handleBlur}
                  onChange={handleChange}
                  variant="outlined"
                  my={2}
                />
              </Grid>
              <Grid item md={1}>
                <TextField
                  // name={resultChainIndicator.id + "/1"}
                  // value={values.resultChainIndicator.id + "/1"}
                  // error={Boolean(
                  //   touched.resultChainIndicator.id + "/1" &&
                  //     errors.resultChainIndicator.id + "/1"
                  // )}
                  fullWidth
                  // helperText={
                  //   touched.resultChainIndicator.id + "/1" &&
                  //   errors.resultChainIndicator.id + "/1"
                  // }
                  onBlur={handleBlur}
                  onChange={handleChange}
                  variant="outlined"
                  my={2}
                />
              </Grid>
              <Grid item md={1}>
                <TextField
                  // name={resultChainIndicator.id + "/1"}
                  // value={values.resultChainIndicator.id + "/1"}
                  // error={Boolean(
                  //   touched.resultChainIndicator.id + "/1" &&
                  //     errors.resultChainIndicator.id + "/1"
                  // )}
                  fullWidth
                  // helperText={
                  //   touched.resultChainIndicator.id + "/1" &&
                  //   errors.resultChainIndicator.id + "/1"
                  // }
                  onBlur={handleBlur}
                  onChange={handleChange}
                  variant="outlined"
                  my={2}
                />
              </Grid>
              <Grid item md={1}>
                <TextField
                  // name={resultChainIndicator.id + "/1"}
                  // value={values.resultChainIndicator.id + "/1"}
                  // error={Boolean(
                  //   touched.resultChainIndicator.id + "/1" &&
                  //     errors.resultChainIndicator.id + "/1"
                  // )}
                  fullWidth
                  // helperText={
                  //   touched.resultChainIndicator.id + "/1" &&
                  //   errors.resultChainIndicator.id + "/1"
                  // }
                  onBlur={handleBlur}
                  onChange={handleChange}
                  variant="outlined"
                  my={2}
                />
              </Grid>
              <Grid item md={1}>
                <TextField
                  // name={resultChainIndicator.id + "/1"}
                  // value={values.resultChainIndicator.id + "/1"}
                  // error={Boolean(
                  //   touched.resultChainIndicator.id + "/1" &&
                  //     errors.resultChainIndicator.id + "/1"
                  // )}
                  fullWidth
                  // helperText={
                  //   touched.resultChainIndicator.id + "/1" &&
                  //   errors.resultChainIndicator.id + "/1"
                  // }
                  onBlur={handleBlur}
                  onChange={handleChange}
                  variant="outlined"
                  my={2}
                />
              </Grid>
              <Grid item md={1}>
                <TextField
                  // name={resultChainIndicator.id + "/1"}
                  // value={values.resultChainIndicator.id + "/1"}
                  // error={Boolean(
                  //   touched.resultChainIndicator.id + "/1" &&
                  //     errors.resultChainIndicator.id + "/1"
                  // )}
                  fullWidth
                  // helperText={
                  //   touched.resultChainIndicator.id + "/1" &&
                  //   errors.resultChainIndicator.id + "/1"
                  // }
                  onBlur={handleBlur}
                  onChange={handleChange}
                  variant="outlined"
                  my={2}
                />
              </Grid>
              <Grid item md={1}>
                <TextField
                  // name={resultChainIndicator.id + "/1"}
                  // value={values.resultChainIndicator.id + "/1"}
                  // error={Boolean(
                  //   touched.resultChainIndicator.id + "/1" &&
                  //     errors.resultChainIndicator.id + "/1"
                  // )}
                  fullWidth
                  // helperText={
                  //   touched.resultChainIndicator.id + "/1" &&
                  //   errors.resultChainIndicator.id + "/1"
                  // }
                  onBlur={handleBlur}
                  onChange={handleChange}
                  variant="outlined"
                  my={2}
                />
              </Grid>
              <Grid item md={1}>
                <TextField
                  // name={resultChainIndicator.id + "/1"}
                  // value={values.resultChainIndicator.id + "/1"}
                  // error={Boolean(
                  //   touched.resultChainIndicator.id + "/1" &&
                  //     errors.resultChainIndicator.id + "/1"
                  // )}
                  fullWidth
                  // helperText={
                  //   touched.resultChainIndicator.id + "/1" &&
                  //   errors.resultChainIndicator.id + "/1"
                  // }
                  onBlur={handleBlur}
                  onChange={handleChange}
                  variant="outlined"
                  my={2}
                />
              </Grid>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};
const ResultIndicatorReportingFrequency = ({ reportingFrequencyId }) => {
  const { data, isLoading, isError } = useQuery(
    ["lookupItem", reportingFrequencyId],
    lookupItem,
    { enabled: !!reportingFrequencyId }
  );
  return `Reporting Frequency: ${!isLoading && !isError ? data.data.name : ""}`;
};
const ResultIndicatorHeader = ({ resultChainIndicator }) => {
  const { data, isLoading, isError } = useQuery(
    ["lookupItem", resultChainIndicator.indicatorMeasureId],
    lookupItem,
    { enabled: !!resultChainIndicator.indicatorMeasureId }
  );
  return (
    <Grid container direction="row" justifyContent="left" alignItems="center">
      <Grid item md={12}>
        <Typography variant="h6" gutterBottom display="inline">
          {!isLoading && !isError && data.data.name === "Number(#)"
            ? "#"
            : "Percentage(%)"}
          &nbsp;
          {resultChainIndicator.indicator.name}
          &nbsp;Baseline Value: &nbsp;
          {resultChainIndicator ? resultChainIndicator.baseline : ""}
          &nbsp;
          <ResultIndicatorReportingFrequency
            reportingFrequencyId={resultChainIndicator.reportingFrequencyId}
          />
        </Typography>
      </Grid>
    </Grid>
  );
};
const ProjectIndicatorTargetsForm = () => {
  let { processLevelItemId, processLevelTypeId, projectLocationId, year } =
    useParams();
  const { data, isLoading, isError } = useQuery(
    [
      "getGeographicalFocusByAdminUnitIdAndProcessLevelItemId",
      projectLocationId,
      processLevelItemId,
    ],
    getGeographicalFocusByAdminUnitIdAndProcessLevelItemId,
    { enabled: !!projectLocationId }
  );
  const {
    data: dataYear,
    isLoading: isLoadingYear,
    isError: isErrorYear,
  } = useQuery(["lookupItem", year], lookupItem, { enabled: !!year });
  const {
    data: resultChainIndicators,
    isLoading: isLoadingResultChainIndicators,
    isError: isErrorResultChainIndicators,
  } = useQuery(
    ["getResultChainIndicatorByProjectId", processLevelItemId],
    getResultChainIndicatorByProjectId,
    { enabled: !!processLevelItemId }
  );
  return (
    <Card mb={6}>
      <CardContent>
        <Grid container spacing={12}>
          <Grid item md={6}>
            <Typography variant="h6" gutterBottom display="inline">
              Location: &nbsp;
              {!isLoading && !isError ? data.data.administrativeUnitName : ""}
            </Typography>
          </Grid>
          <Grid item md={6}>
            <Typography variant="h6" gutterBottom display="inline">
              Implementation Year:&nbsp;
              {!isLoadingYear && !isErrorYear ? dataYear.data.name : ""}
            </Typography>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={2}>
          <Grid item md={1}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item md={1}>
                #
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={11}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item md={1}>
                JAN
              </Grid>
              <Grid item md={1}>
                FEB
              </Grid>
              <Grid item md={1}>
                MAR
              </Grid>
              <Grid item md={1}>
                APR
              </Grid>
              <Grid item md={1}>
                MAY
              </Grid>
              <Grid item md={1}>
                JUN
              </Grid>
              <Grid item md={1}>
                JUL
              </Grid>
              <Grid item md={1}>
                AUG
              </Grid>
              <Grid item md={1}>
                SEP
              </Grid>
              <Grid item md={1}>
                OCT
              </Grid>
              <Grid item md={1}>
                NOV
              </Grid>
              <Grid item md={1}>
                DEC
              </Grid>
            </Grid>
          </Grid>
          {!isLoadingResultChainIndicators &&
            !isErrorResultChainIndicators &&
            resultChainIndicators.data.map((resultChainIndicator, index) => (
              <React.Fragment key={resultChainIndicator.id}>
                <Grid item md={1}>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid item md={1}>
                      {index}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={11}>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid item md={12}>
                      <ResultIndicatorHeader
                        resultChainIndicator={resultChainIndicator}
                      />
                    </Grid>
                    <Grid item md={12}>
                      <ResultIndicatorTargetsForm
                        resultChainIndicator={resultChainIndicator}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </React.Fragment>
            ))}
        </Grid>
      </CardContent>
    </Card>
  );
};
const ProjectIndicatorTargets = () => {
  return (
    <React.Fragment>
      <Helmet title="Results Framework: Indicator Targets" />
      <Typography variant="h3" gutterBottom display="inline">
        Results Framework: Indicator Targets
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        {/*<Link*/}
        {/*  component={NavLink}*/}
        {/*  to={`/project/design-project/${processLevelItemId}`}*/}
        {/*>*/}
        {/*  Project Design*/}
        {/*</Link>*/}
        <Typography>
          Project Quantitative Result Framework: Indicator Targets
        </Typography>
      </Breadcrumbs>
      <Divider my={6} />
      <ProjectIndicatorTargetsForm />
    </React.Fragment>
  );
};
export default ProjectIndicatorTargets;
