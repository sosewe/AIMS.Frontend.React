import React from "react";
import styled from "@emotion/styled";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Grid,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjectLocation } from "../../../api/location";
import {
  getLookupItemByName,
  getLookupMasterItemsByName,
  lookupItem,
} from "../../../api/lookup";
import { getResultChainIndicatorByProjectId } from "../../../api/result-chain-indicator";
import ResultIndicatorTargetsParentForm from "./ResultIndicatorTargetsParentForm";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);

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
          <Grid item md={1}>
            <Grid
              container
              wrap="nowrap"
              sx={{ overflow: "auto" }}
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
              wrap="nowrap"
              sx={{ overflow: "auto" }}
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
              <ResultIndicatorTargetsParentForm
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
