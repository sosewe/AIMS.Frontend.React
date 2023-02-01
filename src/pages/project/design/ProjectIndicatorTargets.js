import React, { useCallback, useEffect } from "react";
import styled from "@emotion/styled";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Grid,
  Stack,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import { number, object } from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProjectLocation } from "../../../api/location";
import { getLookupItemByName, lookupItem } from "../../../api/lookup";
import { getResultChainIndicatorByProjectId } from "../../../api/result-chain-indicator";
import { saveProjectTargets } from "../../../api/set-target";
import { Guid } from "../../../utils/guid";
import { toast } from "react-toastify";
import axios from "axios";
import { apiRoutes } from "../../../apiRoutes";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);
const TextField = styled(MuiTextField)(spacing);

interface Fields {
  name: string;
  label: string;
  initialValue: any;
  type: any;
  disabled: boolean;
}

const MonthsEnum = {
  1: "JAN",
  2: "FEB",
  3: "MAR",
  4: "APR",
  5: "MAY",
  6: "JUN",
  7: "JUL",
  8: "AUG",
  9: "SEP",
  10: "OCT",
  11: "NOV",
  12: "DEC",
};
const ResultIndicatorTargetsForm = ({
  resultChainIndicator,
  processLevelItemId,
  processLevelTypeId,
  projectLocationId,
  implementationYearId,
}) => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery(
    ["lookupItem", resultChainIndicator.reportingFrequencyId],
    lookupItem,
    { enabled: !!resultChainIndicator.reportingFrequencyId }
  );
  const {
    data: dataJAN,
    isLoading: isLoadingJAN,
    isError: isErrorJAN,
  } = useQuery(["getLookupItemByName", "JAN"], getLookupItemByName);
  const {
    data: dataFEB,
    isLoading: isLoadingFEB,
    isError: isErrorFEB,
  } = useQuery(["getLookupItemByName", "FEB"], getLookupItemByName);
  const {
    data: dataMAR,
    isLoading: isLoadingMAR,
    isError: isErrorMAR,
  } = useQuery(["getLookupItemByName", "MAR"], getLookupItemByName);
  const {
    data: dataAPR,
    isLoading: isLoadingAPR,
    isError: isErrorAPR,
  } = useQuery(["getLookupItemByName", "APR"], getLookupItemByName);
  const {
    data: dataMAY,
    isLoading: isLoadingMAY,
    isError: isErrorMAY,
  } = useQuery(["getLookupItemByName", "MAY"], getLookupItemByName);
  const {
    data: dataJUN,
    isLoading: isLoadingJUN,
    isError: isErrorJUN,
  } = useQuery(["getLookupItemByName", "JUN"], getLookupItemByName);
  const {
    data: dataJUL,
    isLoading: isLoadingJUL,
    isError: isErrorJUL,
  } = useQuery(["getLookupItemByName", "JUL"], getLookupItemByName);
  const {
    data: dataAUG,
    isLoading: isLoadingAUG,
    isError: isErrorAUG,
  } = useQuery(["getLookupItemByName", "AUG"], getLookupItemByName);
  const {
    data: dataSEP,
    isLoading: isLoadingSEP,
    isError: isErrorSEP,
  } = useQuery(["getLookupItemByName", "SEP"], getLookupItemByName);
  const {
    data: dataOCT,
    isLoading: isLoadingOCT,
    isError: isErrorOCT,
  } = useQuery(["getLookupItemByName", "OCT"], getLookupItemByName);
  const {
    data: dataNOV,
    isLoading: isLoadingNOV,
    isError: isErrorNOV,
  } = useQuery(["getLookupItemByName", "NOV"], getLookupItemByName);
  const {
    data: dataDEC,
    isLoading: isLoadingDEC,
    isError: isErrorDEC,
  } = useQuery(["getLookupItemByName", "DEC"], getLookupItemByName);
  const mutation = useMutation({ mutationFn: saveProjectTargets });
  // const initialValues = {};
  const fields: Fields[] = [];
  if (!isLoading && !isError) {
    for (let i = 1; i <= 12; i++) {
      let disabledVal = false;
      if (data.data.name === "Monthly(30 days)") {
        const field = {
          id: resultChainIndicator.id,
          name: resultChainIndicator.id + "/" + i.toString(),
          label: resultChainIndicator.id + "/" + i.toString(),
          initialValue: "",
          type: number().required(),
          disabled: disabledVal,
        };
        fields.push(field);
      } else if (data.data.name === "Quarterly(90 days)") {
        let field;
        if (i !== 3 && i !== 6 && i !== 9 && i !== 12) {
          disabledVal = true;
          field = {
            id: resultChainIndicator.id,
            name: resultChainIndicator.id + "/" + i.toString(),
            label: resultChainIndicator.id + "/" + i.toString(),
            initialValue: "",
            type: number(),
            disabled: disabledVal,
          };
        } else {
          disabledVal = false;
          field = {
            id: resultChainIndicator.id,
            name: resultChainIndicator.id + "/" + i.toString(),
            label: resultChainIndicator.id + "/" + i.toString(),
            initialValue: "",
            type: number().required(),
            disabled: disabledVal,
          };
        }
        fields.push(field);
      } else if (data.data.name === "Semi-Annually") {
        let field;
        if (i !== 6 && i !== 12) {
          disabledVal = true;
          field = {
            id: resultChainIndicator.id,
            name: resultChainIndicator.id + "/" + i.toString(),
            label: resultChainIndicator.id + "/" + i.toString(),
            initialValue: "",
            type: number(),
            disabled: disabledVal,
          };
        } else {
          disabledVal = false;
          field = {
            id: resultChainIndicator.id,
            name: resultChainIndicator.id + "/" + i.toString(),
            label: resultChainIndicator.id + "/" + i.toString(),
            initialValue: "",
            type: number().required(),
            disabled: disabledVal,
          };
        }
        fields.push(field);
      } else if (data.data.name === "Annually(365 days)") {
        let field;
        if (i !== 12) {
          disabledVal = true;
          field = {
            id: resultChainIndicator.id,
            name: resultChainIndicator.id + "/" + i.toString(),
            label: resultChainIndicator.id + "/" + i.toString(),
            initialValue: "",
            type: number(),
            disabled: disabledVal,
          };
        } else {
          disabledVal = false;
          field = {
            id: resultChainIndicator.id,
            name: resultChainIndicator.id + "/" + i.toString(),
            label: resultChainIndicator.id + "/" + i.toString(),
            initialValue: "",
            type: number().required(),
            disabled: disabledVal,
          };
        }
        fields.push(field);
      }
    }
  }
  const initialValues = Object.fromEntries(
    fields.map((field) => [field.name, field.initialValue])
  );
  const idValues = Object.values(fields.map((field) => field.id));
  const SchemaObject = Object.fromEntries(
    fields.map((field) => [field.name, field.type])
  );
  const ValidationSchema = object().shape(SchemaObject);
  const onCancel = () => {
    navigate(
      `/project/enter-target-quantitative-results-framework/${processLevelItemId}/${processLevelTypeId}`
    );
  };
  // console.log(idValues);
  // const indicatorTargets = Object.entries(initialValues);
  // if (indicatorTargets.length > 0) {
  //   for (const target of indicatorTargets) {
  //     const resultChainIndicatorArray = target[0].toString().split("/");
  //     console.log(resultChainIndicatorArray);
  //   }
  // }
  const logResult = useCallback(() => {
    for (let i = 0; i < 12; i++) {
      console.log(idValues);
    }
  }, []);
  useEffect(() => {
    logResult();
  }, [logResult]);
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ValidationSchema}
      enableReinitialize={true}
      onSubmit={async (values) => {
        try {
          const InData = [];
          const e = new Guid();
          const indicatorTargets = Object.entries(values);
          if (indicatorTargets.length > 0) {
            for (const target of indicatorTargets) {
              const resultChainIndicatorArray = target[0].toString().split("/");
              const month = MonthsEnum[resultChainIndicatorArray[1]];
              let result;
              if (month === "JAN" && !isLoadingJAN && !isErrorJAN) {
                result = dataJAN.data.id;
              } else if (month === "FEB" && !isLoadingFEB && !isErrorFEB) {
                result = dataFEB.data.id;
              } else if (month === "MAR" && !isLoadingMAR && !isErrorMAR) {
                result = dataMAR.data.id;
              } else if (month === "APR" && !isLoadingAPR && !isErrorAPR) {
                result = dataAPR.data.id;
              } else if (month === "MAY" && !isLoadingMAY && !isErrorMAY) {
                result = dataMAY.data.id;
              } else if (month === "JUN" && !isLoadingJUN && !isErrorJUN) {
                result = dataJUN.data.id;
              } else if (month === "JUL" && !isLoadingJUL && !isErrorJUL) {
                result = dataJUL.data.id;
              } else if (month === "AUG" && !isLoadingAUG && !isErrorAUG) {
                result = dataAUG.data.id;
              } else if (month === "SEP" && !isLoadingSEP && !isErrorSEP) {
                result = dataSEP.data.id;
              } else if (month === "OCT" && !isLoadingOCT && !isErrorOCT) {
                result = dataOCT.data.id;
              } else if (month === "NOV" && !isLoadingNOV && !isErrorNOV) {
                result = dataNOV.data.id;
              } else if (month === "DEC" && !isLoadingDEC && !isErrorDEC) {
                result = dataDEC.data.id;
              }
              if (target[1]) {
                let projectTarget;
                const res = await axios.get(
                  `${apiRoutes.setTarget}/GetSetTarget/${processLevelItemId}/${processLevelTypeId}/${projectLocationId}/${resultChainIndicatorArray[0]}/${implementationYearId}/${result}`
                );
                projectTarget = {
                  id:
                    res && res.data.length > 0 ? res.data[0].id : e.toString(),
                  processLevelItemId: processLevelItemId,
                  processLevelTypeId: processLevelTypeId,
                  createDate: new Date(),
                  implementationYearId: implementationYearId,
                  target: target[1],
                  monthId: result ? result : "",
                  projectGeographicalFocusId: projectLocationId,
                  resultChainIndicatorId: resultChainIndicatorArray[0],
                  yearId: implementationYearId,
                };
                InData.push(projectTarget);
              }
            }
          }
          await mutation.mutateAsync(InData);
          toast("Successfully Saved Targets", {
            type: "success",
          });
        } catch (error) {
          toast(error.response.data, {
            type: "error",
          });
        }
      }}
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
              spacing={2}
            >
              {fields.map(({ label, name, disabled }, index) => (
                <React.Fragment key={index}>
                  <Grid item md={1}>
                    <TextField
                      name={name}
                      value={values[name] || ""}
                      error={Boolean(touched[name] && errors[name])}
                      fullWidth
                      helperText={touched[name] && errors[name]}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      my={2}
                      disabled={disabled}
                      type="number"
                      sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          backgroundColor: "#e9ecef",
                        },
                      }}
                    />
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          </Grid>
          <Stack spacing={2} direction="row">
            <Button type="submit" variant="contained" color="success">
              Add Targets
            </Button>
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={() => onCancel()}
            >
              Cancel
            </Button>
          </Stack>
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
    ["getProjectLocation", projectLocationId],
    getProjectLocation,
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
                        processLevelItemId={processLevelItemId}
                        processLevelTypeId={processLevelTypeId}
                        projectLocationId={projectLocationId}
                        implementationYearId={year}
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
