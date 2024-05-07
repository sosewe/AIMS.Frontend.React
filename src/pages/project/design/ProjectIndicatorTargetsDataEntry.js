import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Guid } from "../../../utils/guid";
import { toast } from "react-toastify";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
  Grid,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import ResultIndicatorHeader from "./ResultIndicatorHeader";
import {
  getLookupItemByName,
  getLookupMasterItemsByName,
} from "../../../api/lookup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getSetTarget, saveProjectTargets } from "../../../api/set-target";
// import { useNavigate } from "react-router-dom";

const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const initialValues = {
  JAN: "",
  FEB: "",
  MAR: "",
  APR: "",
  MAY: "",
  JUN: "",
  JUL: "",
  AUG: "",
  SEP: "",
  OCT: "",
  NOV: "",
  DEC: "",
};
const ProjectIndicatorTargetsDataEntry = ({
  resultChainIndicator,
  processLevelItemId,
  processLevelTypeId,
  projectLocationId,
  year,
}) => {
  // const navigate = useNavigate();
  let reportingFrequency;
  const {
    data: reportingFrequencyData,
    isLoading: isLoadingReportingFrequency,
    isError: isErrorReportingFrequency,
  } = useQuery(
    ["reportingFrequency", "ReportingFrequency"],
    getLookupMasterItemsByName
  );
  if (!isLoadingReportingFrequency && !isErrorReportingFrequency) {
    reportingFrequency = reportingFrequencyData.data.find(
      (obj) => obj.lookupItemId === resultChainIndicator.reportingFrequencyId
    );
  }
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
  let idJAN;
  let idFEB;
  let idMAR;
  let idAPR;
  let idMAY;
  let idJUN;
  let idJUL;
  let idAUG;
  let idSEP;
  let idOCT;
  let idNOV;
  let idDEC;
  if (!isLoadingJAN && !isErrorJAN) {
    idJAN = dataJAN.data.id;
  }
  if (!isLoadingFEB && !isErrorFEB) {
    idFEB = dataFEB.data.id;
  }
  if (!isLoadingMAR && !isErrorMAR) {
    idMAR = dataMAR.data.id;
  }
  if (!isLoadingAPR && !isErrorAPR) {
    idAPR = dataAPR.data.id;
  }
  if (!isLoadingMAY && !isErrorMAY) {
    idMAY = dataMAY.data.id;
  }
  if (!isLoadingJUN && !isErrorJUN) {
    idJUN = dataJUN.data.id;
  }
  if (!isLoadingJUL && !isErrorJUL) {
    idJUL = dataJUL.data.id;
  }
  if (!isLoadingAUG && !isErrorAUG) {
    idAUG = dataAUG.data.id;
  }
  if (!isLoadingSEP && !isErrorSEP) {
    idSEP = dataSEP.data.id;
  }
  if (!isLoadingOCT && !isErrorOCT) {
    idOCT = dataOCT.data.id;
  }
  if (!isLoadingNOV && !isErrorNOV) {
    idNOV = dataNOV.data.id;
  }
  if (!isLoadingDEC && !isErrorDEC) {
    idDEC = dataDEC.data.id;
  }
  const {
    data: dataResultJAN,
    isLoading: isLoadingResultJAN,
    isError: isErrorResultJAN,
  } = useQuery(
    [
      "getSetTarget",
      processLevelItemId,
      processLevelTypeId,
      projectLocationId,
      resultChainIndicator.id,
      year,
      idJAN,
    ],
    getSetTarget,
    { enabled: !!idJAN }
  );
  const {
    data: dataResultFEB,
    isLoading: isLoadingResultFEB,
    isError: isErrorResultFEB,
  } = useQuery(
    [
      "getSetTarget",
      processLevelItemId,
      processLevelTypeId,
      projectLocationId,
      resultChainIndicator.id,
      year,
      idFEB,
    ],
    getSetTarget,
    { enabled: !!idFEB }
  );
  const {
    data: dataResultMAR,
    isLoading: isLoadingResultMAR,
    isError: isErrorResultMAR,
  } = useQuery(
    [
      "getSetTarget",
      processLevelItemId,
      processLevelTypeId,
      projectLocationId,
      resultChainIndicator.id,
      year,
      idMAR,
    ],
    getSetTarget,
    { enabled: !!idMAR }
  );
  const {
    data: dataResultAPR,
    isLoading: isLoadingResultAPR,
    isError: isErrorResultAPR,
  } = useQuery(
    [
      "getSetTarget",
      processLevelItemId,
      processLevelTypeId,
      projectLocationId,
      resultChainIndicator.id,
      year,
      idAPR,
    ],
    getSetTarget,
    { enabled: !!idAPR }
  );
  const {
    data: dataResultMAY,
    isLoading: isLoadingResultMAY,
    isError: isErrorResultMAY,
  } = useQuery(
    [
      "getSetTarget",
      processLevelItemId,
      processLevelTypeId,
      projectLocationId,
      resultChainIndicator.id,
      year,
      idMAY,
    ],
    getSetTarget,
    { enabled: !!idMAY }
  );
  const {
    data: dataResultJUN,
    isLoading: isLoadingResultJUN,
    isError: isErrorResultJUN,
  } = useQuery(
    [
      "getSetTarget",
      processLevelItemId,
      processLevelTypeId,
      projectLocationId,
      resultChainIndicator.id,
      year,
      idJUN,
    ],
    getSetTarget,
    { enabled: !!idJUN }
  );
  const {
    data: dataResultJUL,
    isLoading: isLoadingResultJUL,
    isError: isErrorResultJUL,
  } = useQuery(
    [
      "getSetTarget",
      processLevelItemId,
      processLevelTypeId,
      projectLocationId,
      resultChainIndicator.id,
      year,
      idJUL,
    ],
    getSetTarget,
    { enabled: !!idJUL }
  );
  const {
    data: dataResultAUG,
    isLoading: isLoadingResultAUG,
    isError: isErrorResultAUG,
  } = useQuery(
    [
      "getSetTarget",
      processLevelItemId,
      processLevelTypeId,
      projectLocationId,
      resultChainIndicator.id,
      year,
      idAUG,
    ],
    getSetTarget,
    { enabled: !!idAUG }
  );
  const {
    data: dataResultSEP,
    isLoading: isLoadingResultSEP,
    isError: isErrorResultSEP,
  } = useQuery(
    [
      "getSetTarget",
      processLevelItemId,
      processLevelTypeId,
      projectLocationId,
      resultChainIndicator.id,
      year,
      idSEP,
    ],
    getSetTarget,
    { enabled: !!idSEP }
  );
  const {
    data: dataResultOCT,
    isLoading: isLoadingResultOCT,
    isError: isErrorResultOCT,
  } = useQuery(
    [
      "getSetTarget",
      processLevelItemId,
      processLevelTypeId,
      projectLocationId,
      resultChainIndicator.id,
      year,
      idOCT,
    ],
    getSetTarget,
    { enabled: !!idOCT }
  );
  const {
    data: dataResultNOV,
    isLoading: isLoadingResultNOV,
    isError: isErrorResultNOV,
  } = useQuery(
    [
      "getSetTarget",
      processLevelItemId,
      processLevelTypeId,
      projectLocationId,
      resultChainIndicator.id,
      year,
      idNOV,
    ],
    getSetTarget,
    { enabled: !!idNOV }
  );
  const {
    data: dataResultDEC,
    isLoading: isLoadingResultDEC,
    isError: isErrorResultDEC,
  } = useQuery(
    [
      "getSetTarget",
      processLevelItemId,
      processLevelTypeId,
      projectLocationId,
      resultChainIndicator.id,
      year,
      idDEC,
    ],
    getSetTarget,
    { enabled: !!idDEC }
  );
  const mutation = useMutation({ mutationFn: saveProjectTargets });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      JAN: Yup.number().nullable(true),
      FEB: Yup.number().nullable(true),
      MAR: Yup.number().nullable(true),
      APR: Yup.number().nullable(true),
      MAY: Yup.number().nullable(true),
      JUN: Yup.number().nullable(true),
      JUL: Yup.number().nullable(true),
      AUG: Yup.number().nullable(true),
      SEP: Yup.number().nullable(true),
      OCT: Yup.number().nullable(true),
      NOV: Yup.number().nullable(true),
      DEC: Yup.number().nullable(true),
    }),
    onSubmit: async (values) => {
      try {
        const e = new Guid();
        const InData = [];
        let projectTarget;
        if (values.JAN) {
          projectTarget = {
            id:
              !isLoadingResultJAN &&
              !isErrorResultJAN &&
              dataResultJAN.data.length > 0
                ? dataResultJAN.data[0].id
                : e.toString(),
            processLevelItemId: processLevelItemId,
            processLevelTypeId: processLevelTypeId,
            createDate: new Date(),
            implementationYearId: year,
            target: values.JAN,
            monthId: idJAN ? idJAN : "",
            projectGeographicalFocusId: projectLocationId,
            resultChainIndicatorId: resultChainIndicator.id,
            yearId: year,
          };
          InData.push(projectTarget);
        }
        if (values.FEB) {
          projectTarget = {
            id:
              !isLoadingResultFEB &&
              !isErrorResultFEB &&
              dataResultFEB.data.length > 0
                ? dataResultFEB.data[0].id
                : e.toString(),
            processLevelItemId: processLevelItemId,
            processLevelTypeId: processLevelTypeId,
            createDate: new Date(),
            implementationYearId: year,
            target: values.FEB,
            monthId: idFEB ? idFEB : "",
            projectGeographicalFocusId: projectLocationId,
            resultChainIndicatorId: resultChainIndicator.id,
            yearId: year,
          };
          InData.push(projectTarget);
        }
        if (values.MAR) {
          projectTarget = {
            id:
              !isLoadingResultMAR &&
              !isErrorResultMAR &&
              dataResultMAR.data.length > 0
                ? dataResultMAR.data[0].id
                : e.toString(),
            processLevelItemId: processLevelItemId,
            processLevelTypeId: processLevelTypeId,
            createDate: new Date(),
            implementationYearId: year,
            target: values.MAR,
            monthId: idMAR ? idMAR : "",
            projectGeographicalFocusId: projectLocationId,
            resultChainIndicatorId: resultChainIndicator.id,
            yearId: year,
          };
          InData.push(projectTarget);
        }
        if (values.APR) {
          projectTarget = {
            id:
              !isLoadingResultAPR &&
              !isErrorResultAPR &&
              dataResultAPR.data.length > 0
                ? dataResultAPR.data[0].id
                : e.toString(),
            processLevelItemId: processLevelItemId,
            processLevelTypeId: processLevelTypeId,
            createDate: new Date(),
            implementationYearId: year,
            target: values.APR,
            monthId: idAPR ? idAPR : "",
            projectGeographicalFocusId: projectLocationId,
            resultChainIndicatorId: resultChainIndicator.id,
            yearId: year,
          };
          InData.push(projectTarget);
        }
        if (values.MAY) {
          projectTarget = {
            id:
              !isLoadingResultMAY &&
              !isErrorResultMAY &&
              dataResultMAY.data.length > 0
                ? dataResultMAY.data[0].id
                : e.toString(),
            processLevelItemId: processLevelItemId,
            processLevelTypeId: processLevelTypeId,
            createDate: new Date(),
            implementationYearId: year,
            target: values.MAY,
            monthId: idMAY ? idMAY : "",
            projectGeographicalFocusId: projectLocationId,
            resultChainIndicatorId: resultChainIndicator.id,
            yearId: year,
          };
          InData.push(projectTarget);
        }
        if (values.JUN) {
          projectTarget = {
            id:
              !isLoadingResultJUN &&
              !isErrorResultJUN &&
              dataResultJUN.data.length > 0
                ? dataResultJUN.data[0].id
                : e.toString(),
            processLevelItemId: processLevelItemId,
            processLevelTypeId: processLevelTypeId,
            createDate: new Date(),
            implementationYearId: year,
            target: values.JUN,
            monthId: idJUN ? idJUN : "",
            projectGeographicalFocusId: projectLocationId,
            resultChainIndicatorId: resultChainIndicator.id,
            yearId: year,
          };
          InData.push(projectTarget);
        }
        if (values.JUL) {
          projectTarget = {
            id:
              !isLoadingResultJUL &&
              !isErrorResultJUL &&
              dataResultJUL.data.length > 0
                ? dataResultJUL.data[0].id
                : e.toString(),
            processLevelItemId: processLevelItemId,
            processLevelTypeId: processLevelTypeId,
            createDate: new Date(),
            implementationYearId: year,
            target: values.JUL,
            monthId: idJUL ? idJUL : "",
            projectGeographicalFocusId: projectLocationId,
            resultChainIndicatorId: resultChainIndicator.id,
            yearId: year,
          };
          InData.push(projectTarget);
        }
        if (values.AUG) {
          projectTarget = {
            id:
              !isLoadingResultAUG &&
              !isErrorResultAUG &&
              dataResultAUG.data.length > 0
                ? dataResultAUG.data[0].id
                : e.toString(),
            processLevelItemId: processLevelItemId,
            processLevelTypeId: processLevelTypeId,
            createDate: new Date(),
            implementationYearId: year,
            target: values.AUG,
            monthId: idAUG ? idAUG : "",
            projectGeographicalFocusId: projectLocationId,
            resultChainIndicatorId: resultChainIndicator.id,
            yearId: year,
          };
          InData.push(projectTarget);
        }
        if (values.SEP) {
          projectTarget = {
            id:
              !isLoadingResultSEP &&
              !isErrorResultSEP &&
              dataResultSEP.data.length > 0
                ? dataResultSEP.data[0].id
                : e.toString(),
            processLevelItemId: processLevelItemId,
            processLevelTypeId: processLevelTypeId,
            createDate: new Date(),
            implementationYearId: year,
            target: values.SEP,
            monthId: idSEP ? idSEP : "",
            projectGeographicalFocusId: projectLocationId,
            resultChainIndicatorId: resultChainIndicator.id,
            yearId: year,
          };
          InData.push(projectTarget);
        }
        if (values.OCT) {
          projectTarget = {
            id:
              !isLoadingResultOCT &&
              !isErrorResultOCT &&
              dataResultOCT.data.length > 0
                ? dataResultOCT.data[0].id
                : e.toString(),
            processLevelItemId: processLevelItemId,
            processLevelTypeId: processLevelTypeId,
            createDate: new Date(),
            implementationYearId: year,
            target: values.OCT,
            monthId: idOCT ? idOCT : "",
            projectGeographicalFocusId: projectLocationId,
            resultChainIndicatorId: resultChainIndicator.id,
            yearId: year,
          };
          InData.push(projectTarget);
        }
        if (values.NOV) {
          projectTarget = {
            id:
              !isLoadingResultNOV &&
              !isErrorResultNOV &&
              dataResultNOV.data.length > 0
                ? dataResultNOV.data[0].id
                : e.toString(),
            processLevelItemId: processLevelItemId,
            processLevelTypeId: processLevelTypeId,
            createDate: new Date(),
            implementationYearId: year,
            target: values.NOV,
            monthId: idNOV ? idNOV : "",
            projectGeographicalFocusId: projectLocationId,
            resultChainIndicatorId: resultChainIndicator.id,
            yearId: year,
          };
          InData.push(projectTarget);
        }
        if (values.DEC) {
          projectTarget = {
            id:
              !isLoadingResultDEC &&
              !isErrorResultDEC &&
              dataResultDEC.data.length > 0
                ? dataResultDEC.data[0].id
                : e.toString(),
            processLevelItemId: processLevelItemId,
            processLevelTypeId: processLevelTypeId,
            createDate: new Date(),
            implementationYearId: year,
            target: values.DEC,
            monthId: idDEC ? idDEC : "",
            projectGeographicalFocusId: projectLocationId,
            resultChainIndicatorId: resultChainIndicator.id,
            yearId: year,
          };
          InData.push(projectTarget);
        }
        await mutation.mutateAsync(InData);
        toast("Successfully Created an Administrative Programme", {
          type: "success",
        });
        // navigate(
        //   `/project-access/project-indicator-targets-view/${processLevelItemId}/${processLevelTypeId}/${projectLocationId}/${year}`
        // );
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  useEffect(() => {
    function setCurrentFormValues() {
      if (!isLoadingResultJAN && !isErrorResultJAN) {
        formik.setValues({
          JAN:
            !isLoadingResultJAN &&
            !isErrorResultJAN &&
            dataResultJAN.data &&
            dataResultJAN.data.length > 0
              ? dataResultJAN.data[0].target
              : "",
          FEB:
            !isLoadingResultFEB &&
            !isErrorResultFEB &&
            dataResultFEB.data &&
            dataResultFEB.data.length > 0
              ? dataResultFEB.data[0].target
              : "",
          MAR:
            !isLoadingResultMAR &&
            !isErrorResultMAR &&
            dataResultMAR.data &&
            dataResultMAR.data.length > 0
              ? dataResultMAR.data[0].target
              : "",
          APR:
            !isLoadingResultAPR &&
            !isErrorResultAPR &&
            dataResultAPR.data &&
            dataResultAPR.data.length > 0
              ? dataResultAPR.data[0].target
              : "",
          MAY:
            !isLoadingResultMAY &&
            !isErrorResultMAY &&
            dataResultMAY.data &&
            dataResultMAY.data.length > 0
              ? dataResultMAY.data[0].target
              : "",
          JUN:
            !isLoadingResultJUN &&
            !isErrorResultJUN &&
            dataResultJUN.data &&
            dataResultJUN.data.length > 0
              ? dataResultJUN.data[0].target
              : "",
          JUL:
            !isLoadingResultJUL &&
            !isErrorResultJUL &&
            dataResultJUL.data &&
            dataResultJUL.data.length > 0
              ? dataResultJUL.data[0].target
              : "",
          AUG:
            !isLoadingResultAUG &&
            !isErrorResultAUG &&
            dataResultAUG.data &&
            dataResultAUG.data.length > 0
              ? dataResultAUG.data[0].target
              : "",
          SEP:
            !isLoadingResultSEP &&
            !isErrorResultSEP &&
            dataResultSEP.data &&
            dataResultSEP.data.length > 0
              ? dataResultSEP.data[0].target
              : "",
          OCT:
            !isLoadingResultOCT &&
            !isErrorResultOCT &&
            dataResultOCT.data &&
            dataResultOCT.data.length > 0
              ? dataResultOCT.data[0].target
              : "",
          NOV:
            !isLoadingResultNOV &&
            !isErrorResultNOV &&
            dataResultNOV.data &&
            dataResultNOV.data.length > 0
              ? dataResultNOV.data[0].target
              : "",
          DEC:
            !isLoadingResultDEC &&
            !isErrorResultDEC &&
            dataResultDEC.data &&
            dataResultDEC.data.length > 0
              ? dataResultDEC.data[0].target
              : "",
        });
      }
    }
    setCurrentFormValues();
  }, [
    dataResultJAN,
    dataResultFEB,
    dataResultMAR,
    dataResultAPR,
    dataResultMAY,
    dataResultJUN,
    dataResultJUL,
    dataResultAUG,
    dataResultSEP,
    dataResultOCT,
    dataResultNOV,
    dataResultDEC,
    isLoadingResultJAN,
    isLoadingResultFEB,
    isLoadingResultMAR,
    isLoadingResultAPR,
    isLoadingResultMAY,
    isLoadingResultJUN,
    isLoadingResultJUL,
    isLoadingResultAUG,
    isLoadingResultSEP,
    isLoadingResultOCT,
    isLoadingResultNOV,
    isLoadingResultDEC,
    isErrorResultJAN,
    isErrorResultFEB,
    isErrorResultMAR,
    isErrorResultAPR,
    isErrorResultMAY,
    isErrorResultJUN,
    isErrorResultJUL,
    isErrorResultAUG,
    isErrorResultSEP,
    isErrorResultOCT,
    isErrorResultNOV,
    isErrorResultDEC,
  ]);
  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid
        container
        wrap="nowrap"
        sx={{ overflow: "auto" }}
        direction="row"
        spacing={2}
      >
        <Grid item md={12}>
          <ResultIndicatorHeader resultChainIndicator={resultChainIndicator} />
        </Grid>
      </Grid>
      <Grid
        container
        wrap="nowrap"
        sx={{ overflow: "auto" }}
        direction="row"
        spacing={2}
      >
        <Grid item md={11}>
          <Grid container spacing={2}>
            <Grid item md={2}>
              <TextField
                name="JAN"
                label="JAN"
                value={formik.values.JAN}
                error={Boolean(formik.touched.JAN && formik.errors.JAN)}
                fullWidth
                helperText={formik.touched.JAN && formik.errors.JAN}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
                disabled={
                  reportingFrequency &&
                  (reportingFrequency.lookupItemName === "Quarterly(90 days)" ||
                    reportingFrequency.lookupItemName === "Semi-Annually" ||
                    reportingFrequency.lookupItemName === "Annually(365 days)")
                }
                type="number"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    backgroundColor: "#e9ecef",
                  },
                }}
              />
            </Grid>
            <Grid item md={2}>
              <TextField
                name="FEB"
                label="FEB"
                value={formik.values.FEB}
                error={Boolean(formik.touched.FEB && formik.errors.FEB)}
                fullWidth
                helperText={formik.touched.FEB && formik.errors.FEB}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
                disabled={
                  reportingFrequency &&
                  (reportingFrequency.lookupItemName === "Quarterly(90 days)" ||
                    reportingFrequency.lookupItemName === "Semi-Annually" ||
                    reportingFrequency.lookupItemName === "Annually(365 days)")
                }
                type="number"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    backgroundColor: "#e9ecef",
                  },
                }}
              />
            </Grid>
            <Grid item md={2}>
              <TextField
                name="MAR"
                label="MAR"
                value={formik.values.MAR}
                error={Boolean(formik.touched.MAR && formik.errors.MAR)}
                fullWidth
                helperText={formik.touched.MAR && formik.errors.MAR}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
                disabled={
                  reportingFrequency &&
                  (reportingFrequency.lookupItemName === "Semi-Annually" ||
                    reportingFrequency.lookupItemName === "Annually(365 days)")
                }
                type="number"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    backgroundColor: "#e9ecef",
                  },
                }}
              />
            </Grid>
            <Grid item md={2}>
              <TextField
                name="APR"
                label="APR"
                value={formik.values.APR}
                error={Boolean(formik.touched.APR && formik.errors.APR)}
                fullWidth
                helperText={formik.touched.APR && formik.errors.APR}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
                disabled={
                  reportingFrequency &&
                  (reportingFrequency.lookupItemName === "Quarterly(90 days)" ||
                    reportingFrequency.lookupItemName === "Semi-Annually" ||
                    reportingFrequency.lookupItemName === "Annually(365 days)")
                }
                type="number"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    backgroundColor: "#e9ecef",
                  },
                }}
              />
            </Grid>
            <Grid item md={2}>
              <TextField
                name="MAY"
                label="MAY"
                value={formik.values.MAY}
                error={Boolean(formik.touched.MAY && formik.errors.MAY)}
                fullWidth
                helperText={formik.touched.MAY && formik.errors.MAY}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
                disabled={
                  reportingFrequency &&
                  (reportingFrequency.lookupItemName === "Quarterly(90 days)" ||
                    reportingFrequency.lookupItemName === "Semi-Annually" ||
                    reportingFrequency.lookupItemName === "Annually(365 days)")
                }
                type="number"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    backgroundColor: "#e9ecef",
                  },
                }}
              />
            </Grid>
            <Grid item md={2}>
              <TextField
                name="JUN"
                label="JUN"
                value={formik.values.JUN}
                error={Boolean(formik.touched.JUN && formik.errors.JUN)}
                fullWidth
                helperText={formik.touched.JUN && formik.errors.JUN}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
                disabled={
                  reportingFrequency &&
                  reportingFrequency.lookupItemName === "Annually(365 days)"
                }
                type="number"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    backgroundColor: "#e9ecef",
                  },
                }}
              />
            </Grid>
            <Grid item md={2}>
              <TextField
                name="JUL"
                label="JUL"
                value={formik.values.JUL}
                error={Boolean(formik.touched.JUL && formik.errors.JUL)}
                fullWidth
                helperText={formik.touched.JUL && formik.errors.JUL}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
                disabled={
                  reportingFrequency &&
                  (reportingFrequency.lookupItemName === "Quarterly(90 days)" ||
                    reportingFrequency.lookupItemName === "Semi-Annually" ||
                    reportingFrequency.lookupItemName === "Annually(365 days)")
                }
                type="number"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    backgroundColor: "#e9ecef",
                  },
                }}
              />
            </Grid>
            <Grid item md={2}>
              <TextField
                name="AUG"
                label="AUG"
                value={formik.values.AUG}
                error={Boolean(formik.touched.AUG && formik.errors.AUG)}
                fullWidth
                helperText={formik.touched.AUG && formik.errors.AUG}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
                disabled={
                  reportingFrequency &&
                  (reportingFrequency.lookupItemName === "Quarterly(90 days)" ||
                    reportingFrequency.lookupItemName === "Semi-Annually" ||
                    reportingFrequency.lookupItemName === "Annually(365 days)")
                }
                type="number"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    backgroundColor: "#e9ecef",
                  },
                }}
              />
            </Grid>
            <Grid item md={2}>
              <TextField
                name="SEP"
                label="SEP"
                value={formik.values.SEP}
                error={Boolean(formik.touched.SEP && formik.errors.SEP)}
                fullWidth
                helperText={formik.touched.SEP && formik.errors.SEP}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
                disabled={
                  reportingFrequency &&
                  (reportingFrequency.lookupItemName === "Semi-Annually" ||
                    reportingFrequency.lookupItemName === "Annually(365 days)")
                }
                type="number"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    backgroundColor: "#e9ecef",
                  },
                }}
              />
            </Grid>
            <Grid item md={2}>
              <TextField
                name="OCT"
                label="OCT"
                value={formik.values.OCT}
                error={Boolean(formik.touched.OCT && formik.errors.OCT)}
                fullWidth
                helperText={formik.touched.OCT && formik.errors.OCT}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
                disabled={
                  reportingFrequency &&
                  (reportingFrequency.lookupItemName === "Quarterly(90 days)" ||
                    reportingFrequency.lookupItemName === "Semi-Annually" ||
                    reportingFrequency.lookupItemName === "Annually(365 days)")
                }
                type="number"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    backgroundColor: "#e9ecef",
                  },
                }}
              />
            </Grid>
            <Grid item md={2}>
              <TextField
                name="NOV"
                label="NOV"
                value={formik.values.NOV}
                error={Boolean(formik.touched.NOV && formik.errors.NOV)}
                fullWidth
                helperText={formik.touched.NOV && formik.errors.NOV}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
                disabled={
                  reportingFrequency &&
                  (reportingFrequency.lookupItemName === "Quarterly(90 days)" ||
                    reportingFrequency.lookupItemName === "Semi-Annually" ||
                    reportingFrequency.lookupItemName === "Annually(365 days)")
                }
                type="number"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    backgroundColor: "#e9ecef",
                  },
                }}
              />
            </Grid>
            <Grid item md={2}>
              <TextField
                name="DEC"
                label="DEC"
                value={formik.values.DEC}
                error={Boolean(formik.touched.DEC && formik.errors.DEC)}
                fullWidth
                helperText={formik.touched.DEC && formik.errors.DEC}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
                type="number"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={1}>
          <Typography align="center">
            <Button type="submit" variant="contained" color="primary" mt={12}>
              Save
            </Button>
          </Typography>
        </Grid>
      </Grid>
    </form>
  );
};
export default ProjectIndicatorTargetsDataEntry;
