import React, { useCallback, useEffect } from "react";
import styled from "@emotion/styled";
import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CircularProgress,
  Divider as MuiDivider,
  Grid,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProjectLocation } from "../../../api/location";
import {
  getLookupItemByName,
  getLookupMasterItemsByName,
  lookupItem,
} from "../../../api/lookup";
import { getResultChainIndicatorByProjectId } from "../../../api/result-chain-indicator";
import { number, object } from "yup";
import { saveProjectTargets } from "../../../api/set-target";
import { useFormik } from "formik";
import { Guid } from "../../../utils/guid";
import axios from "axios";
import { apiRoutes } from "../../../apiRoutes";
import { toast } from "react-toastify";
import ResultIndicatorHeader from "./ResultIndicatorHeader";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
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

const ResultIndicatorTargetsViewForm = ({
  reportingFrequencyData,
  resultChainIndicators,
  processLevelItemId,
  processLevelTypeId,
  dataJAN,
  dataFEB,
  dataMAR,
  dataAPR,
  dataMAY,
  dataJUN,
  dataJUL,
  dataAUG,
  dataSEP,
  dataOCT,
  dataNOV,
  dataDEC,
  projectLocationId,
  year,
}) => {
  const fields = [];
  const schemaField: Fields[] = [];
  for (const resultChainIndicator of resultChainIndicators) {
    const resulti = [];
    for (let i = 1; i <= 12; i++) {
      let disabledVal = false;
      const reportingFrequency = reportingFrequencyData.find(
        (obj) => obj.lookupItemId === resultChainIndicator.reportingFrequencyId
      );
      if (
        reportingFrequency &&
        reportingFrequency.lookupItemName === "Monthly(30 days)"
      ) {
        const field = {
          id: resultChainIndicator.id,
          name: resultChainIndicator.id + "/" + i.toString(),
          label: MonthsEnum[i],
          initialValue: "",
          type: number().required(),
          disabled: disabledVal,
        };
        schemaField.push(field);
        resulti.push(field);
      } else if (
        reportingFrequency &&
        reportingFrequency.lookupItemName === "Quarterly(90 days)"
      ) {
        let field;
        if (i !== 3 && i !== 6 && i !== 9 && i !== 12) {
          disabledVal = true;
          field = {
            id: resultChainIndicator.id,
            name: resultChainIndicator.id + "/" + i.toString(),
            label: MonthsEnum[i],
            initialValue: "",
            type: number(),
            disabled: disabledVal,
          };
        } else {
          disabledVal = false;
          field = {
            id: resultChainIndicator.id,
            name: resultChainIndicator.id + "/" + i.toString(),
            label: MonthsEnum[i],
            initialValue: "",
            type: number().required(),
            disabled: disabledVal,
          };
        }
        schemaField.push(field);
        resulti.push(field);
      } else if (
        reportingFrequency &&
        reportingFrequency.lookupItemName === "Semi-Annually"
      ) {
        let field;
        if (i !== 6 && i !== 12) {
          disabledVal = true;
          field = {
            id: resultChainIndicator.id,
            name: resultChainIndicator.id + "/" + i.toString(),
            label: MonthsEnum[i],
            initialValue: "",
            type: number(),
            disabled: disabledVal,
          };
        } else {
          disabledVal = false;
          field = {
            id: resultChainIndicator.id,
            name: resultChainIndicator.id + "/" + i.toString(),
            label: MonthsEnum[i],
            initialValue: "",
            type: number().required(),
            disabled: disabledVal,
          };
        }
        schemaField.push(field);
        resulti.push(field);
      } else if (
        reportingFrequency &&
        reportingFrequency.lookupItemName === "Annually(365 days)"
      ) {
        let field;
        if (i !== 12) {
          disabledVal = true;
          field = {
            id: resultChainIndicator.id,
            name: resultChainIndicator.id + "/" + i.toString(),
            label: MonthsEnum[i],
            initialValue: "",
            type: number(),
            disabled: disabledVal,
          };
        } else {
          disabledVal = false;
          field = {
            id: resultChainIndicator.id,
            name: resultChainIndicator.id + "/" + i.toString(),
            label: MonthsEnum[i],
            initialValue: "",
            type: number().required(),
            disabled: disabledVal,
          };
        }
        schemaField.push(field);
        resulti.push(field);
      }
    }
    fields.push({ [resultChainIndicator.id]: resulti });
  }
  const formInitial = {};
  const initialValues = fields.map((objField) =>
    Object.values(objField)[0].map((field) => [field.name, field.initialValue])
  );
  for (const initialValue of initialValues) {
    for (const initialValueElement of initialValue) {
      formInitial[initialValueElement[0]] = "";
    }
  }
  const SchemaObject = Object.fromEntries(
    schemaField.map((field) => [field.name, field.type])
  );
  const ValidationSchema = object().shape(SchemaObject);
  const mutation = useMutation({ mutationFn: saveProjectTargets });
  const formik = useFormik({
    initialValues: formInitial,
    validationSchema: ValidationSchema,
    onSubmit: async (values) => {
      try {
        const InData = [];
        const e = new Guid();
        const indicatorTargets = Object.entries(values);
        if (indicatorTargets.length > 0) {
          for (const target of indicatorTargets) {
            const resultChainIndicatorArray = target[0].toString().split("/");
            const month = MonthsEnum[resultChainIndicatorArray[1]];
            let result;
            if (month === "JAN") {
              result = dataJAN.id;
            } else if (month === "FEB") {
              result = dataFEB.id;
            } else if (month === "MAR") {
              result = dataMAR.id;
            } else if (month === "APR") {
              result = dataAPR.id;
            } else if (month === "MAY") {
              result = dataMAY.id;
            } else if (month === "JUN") {
              result = dataJUN.id;
            } else if (month === "JUL") {
              result = dataJUL.id;
            } else if (month === "AUG") {
              result = dataAUG.id;
            } else if (month === "SEP") {
              result = dataSEP.id;
            } else if (month === "OCT") {
              result = dataOCT.id;
            } else if (month === "NOV") {
              result = dataNOV.id;
            } else if (month === "DEC") {
              result = dataDEC.id;
            }
            if (target[1]) {
              let projectTarget;
              const res = await axios.get(
                `${apiRoutes.setTarget}/GetSetTarget/${processLevelItemId}/${processLevelTypeId}/${projectLocationId}/${resultChainIndicatorArray[0]}/${year}/${result}`
              );
              projectTarget = {
                id: res && res.data.length > 0 ? res.data[0].id : e.toString(),
                processLevelItemId: processLevelItemId,
                processLevelTypeId: processLevelTypeId,
                createDate: new Date(),
                implementationYearId: year,
                target: target[1],
                monthId: result ? result : "",
                projectGeographicalFocusId: projectLocationId,
                resultChainIndicatorId: resultChainIndicatorArray[0],
                yearId: year,
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
        console.log(error);
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  const loadProjectTargets = useCallback(async () => {
    await Promise.all(
      resultChainIndicators.map(async (resultChainIndicator) => {
        const response = await axios.get(
          `${apiRoutes.setTarget}/GetSetTarget/${processLevelItemId}/${processLevelTypeId}/${projectLocationId}/${resultChainIndicator.id}/${year}/${dataJAN.id}`
        );
        const resFEB = await axios.get(
          `${apiRoutes.setTarget}/GetSetTarget/${processLevelItemId}/${processLevelTypeId}/${projectLocationId}/${resultChainIndicator.id}/${year}/${dataFEB.id}`
        );
        const resMAR = await axios.get(
          `${apiRoutes.setTarget}/GetSetTarget/${processLevelItemId}/${processLevelTypeId}/${projectLocationId}/${resultChainIndicator.id}/${year}/${dataMAR.id}`
        );
        const resAPR = await axios.get(
          `${apiRoutes.setTarget}/GetSetTarget/${processLevelItemId}/${processLevelTypeId}/${projectLocationId}/${resultChainIndicator.id}/${year}/${dataAPR.id}`
        );
        const resMAY = await axios.get(
          `${apiRoutes.setTarget}/GetSetTarget/${processLevelItemId}/${processLevelTypeId}/${projectLocationId}/${resultChainIndicator.id}/${year}/${dataMAY.id}`
        );
        const resJUN = await axios.get(
          `${apiRoutes.setTarget}/GetSetTarget/${processLevelItemId}/${processLevelTypeId}/${projectLocationId}/${resultChainIndicator.id}/${year}/${dataJUN.id}`
        );
        const resJUL = await axios.get(
          `${apiRoutes.setTarget}/GetSetTarget/${processLevelItemId}/${processLevelTypeId}/${projectLocationId}/${resultChainIndicator.id}/${year}/${dataJUL.id}`
        );
        const resAUG = await axios.get(
          `${apiRoutes.setTarget}/GetSetTarget/${processLevelItemId}/${processLevelTypeId}/${projectLocationId}/${resultChainIndicator.id}/${year}/${dataAUG.id}`
        );
        const resSEP = await axios.get(
          `${apiRoutes.setTarget}/GetSetTarget/${processLevelItemId}/${processLevelTypeId}/${projectLocationId}/${resultChainIndicator.id}/${year}/${dataSEP.id}`
        );
        const resOCT = await axios.get(
          `${apiRoutes.setTarget}/GetSetTarget/${processLevelItemId}/${processLevelTypeId}/${projectLocationId}/${resultChainIndicator.id}/${year}/${dataOCT.id}`
        );
        const resNOV = await axios.get(
          `${apiRoutes.setTarget}/GetSetTarget/${processLevelItemId}/${processLevelTypeId}/${projectLocationId}/${resultChainIndicator.id}/${year}/${dataNOV.id}`
        );
        const resDEC = await axios.get(
          `${apiRoutes.setTarget}/GetSetTarget/${processLevelItemId}/${processLevelTypeId}/${projectLocationId}/${resultChainIndicator.id}/${year}/${dataDEC.id}`
        );
        if (response.status === 200 && response.data.length > 0) {
          await formik.setFieldValue(
            resultChainIndicator.id + "/1",
            response.data[0].target
          );
        }
        if (resFEB.status === 200 && resFEB.data.length > 0) {
          await formik.setFieldValue(
            resultChainIndicator.id + "/2",
            resFEB.data[0].target
          );
        }
        if (resMAR.status === 200 && resMAR.data.length > 0) {
          await formik.setFieldValue(
            resultChainIndicator.id + "/3",
            resMAR.data[0].target
          );
        }
        if (resAPR.status === 200 && resAPR.data.length > 0) {
          await formik.setFieldValue(
            resultChainIndicator.id + "/4",
            resAPR.data[0].target
          );
        }
        if (resMAY.status === 200 && resMAY.data.length > 0) {
          await formik.setFieldValue(
            resultChainIndicator.id + "/5",
            resMAY.data[0].target
          );
        }
        if (resJUN.status === 200 && resJUN.data.length > 0) {
          await formik.setFieldValue(
            resultChainIndicator.id + "/6",
            resJUN.data[0].target
          );
        }
        if (resJUL.status === 200 && resJUL.data.length > 0) {
          await formik.setFieldValue(
            resultChainIndicator.id + "/7",
            resJUL.data[0].target
          );
        }
        if (resAUG.status === 200 && resAUG.data.length > 0) {
          await formik.setFieldValue(
            resultChainIndicator.id + "/8",
            resAUG.data[0].target
          );
        }
        if (resSEP.status === 200 && resSEP.data.length > 0) {
          await formik.setFieldValue(
            resultChainIndicator.id + "/9",
            resSEP.data[0].target
          );
        }
        if (resOCT.status === 200 && resOCT.data.length > 0) {
          await formik.setFieldValue(
            resultChainIndicator.id + "/10",
            resOCT.data[0].target
          );
        }
        if (resNOV.status === 200 && resNOV.data.length > 0) {
          await formik.setFieldValue(
            resultChainIndicator.id + "/11",
            resNOV.data[0].target
          );
        }
        if (resDEC.status === 200 && resDEC.data.length > 0) {
          await formik.setFieldValue(
            resultChainIndicator.id + "/12",
            resDEC.data[0].target
          );
        }
      })
    );
  }, [
    dataJAN,
    dataFEB,
    dataMAR,
    dataAPR,
    dataMAY,
    dataJUN,
    dataJUL,
    dataAUG,
    dataSEP,
    dataOCT,
    dataNOV,
    dataDEC,
    processLevelItemId,
    processLevelTypeId,
    projectLocationId,
    resultChainIndicators,
    year,
  ]);

  useEffect(() => {
    loadProjectTargets();
  }, [loadProjectTargets]);

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
              <Grid
                container
                direction="row"
                justifyContent="left"
                alignItems="left"
                spacing={2}
              >
                {resultChainIndicators.map((resultChainIndicator, i) => {
                  const res = fields.find((obj) =>
                    Object.keys(obj).find(
                      (key) => key === resultChainIndicator.id
                    )
                  );
                  const field = res[resultChainIndicator.id];
                  const allFields = field.map(
                    ({ label, name, disabled }, index) => (
                      <React.Fragment key={index}>
                        <Grid item md={2}>
                          <TextField
                            label={label}
                            value={formik.values[name] || "N/A"}
                            variant="filled"
                            color="success"
                            focused
                          />
                        </Grid>
                      </React.Fragment>
                    )
                  );
                  return (
                    <React.Fragment key={resultChainIndicator.id}>
                      <Grid item md={12}>
                        <ResultIndicatorHeader
                          resultChainIndicator={resultChainIndicator}
                        />
                      </Grid>
                      <Grid item md={12}>
                        <Grid container spacing={2}>
                          {allFields}
                        </Grid>
                      </Grid>
                    </React.Fragment>
                  );
                })}
              </Grid>
            </>
          )}
        </CardContent>
      </Card>
    </form>
  );
};

const ProjectIndicatorTargetsViewTable = () => {
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
  const {
    data: reportingFrequencyData,
    isLoading: isLoadingReportingFrequency,
    isError: isErrorReportingFrequency,
  } = useQuery(
    ["reportingFrequency", "ReportingFrequency"],
    getLookupMasterItemsByName
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
  return (
    <Card mb={6} sx={{ minWidth: "1000px" }}>
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
          <Grid item md={12}>
            {!isLoadingReportingFrequency &&
            !isLoadingResultChainIndicators &&
            !isErrorReportingFrequency &&
            !isLoadingJAN &&
            !isErrorJAN &&
            !isLoadingFEB &&
            !isErrorFEB &&
            !isLoadingMAR &&
            !isErrorMAR &&
            !isLoadingAPR &&
            !isErrorAPR &&
            !isLoadingMAY &&
            !isErrorMAY &&
            !isLoadingJUN &&
            !isErrorJUN &&
            !isLoadingJUL &&
            !isErrorJUL &&
            !isLoadingAUG &&
            !isErrorAUG &&
            !isLoadingSEP &&
            !isErrorSEP &&
            !isLoadingOCT &&
            !isErrorOCT &&
            !isLoadingNOV &&
            !isErrorNOV &&
            !isLoadingDEC &&
            !isErrorDEC &&
            !isErrorResultChainIndicators ? (
              <ResultIndicatorTargetsViewForm
                reportingFrequencyData={reportingFrequencyData.data}
                resultChainIndicators={resultChainIndicators.data}
                processLevelItemId={processLevelItemId}
                processLevelTypeId={processLevelTypeId}
                dataJAN={dataJAN.data}
                dataFEB={dataFEB.data}
                dataMAR={dataMAR.data}
                dataAPR={dataAPR.data}
                dataMAY={dataMAY.data}
                dataJUN={dataJUN.data}
                dataJUL={dataJUL.data}
                dataAUG={dataAUG.data}
                dataSEP={dataSEP.data}
                dataOCT={dataOCT.data}
                dataNOV={dataNOV.data}
                dataDEC={dataDEC.data}
                projectLocationId={projectLocationId}
                year={year}
              />
            ) : (
              ""
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const ProjectIndicatorTargetsView = () => {
  return (
    <React.Fragment>
      <Helmet title="Results Framework: Indicator Targets" />
      <Typography variant="h3" gutterBottom display="inline">
        Results Framework: Indicator Targets
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Typography>
          Project Quantitative Result Framework: Indicator Targets
        </Typography>
      </Breadcrumbs>
      <Divider my={6} />
      <ProjectIndicatorTargetsViewTable />
    </React.Fragment>
  );
};
export default ProjectIndicatorTargetsView;
