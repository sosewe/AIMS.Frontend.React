import React from "react";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  Grid,
  Typography,
} from "@mui/material";
import { getProjectLocation } from "../../../api/location";
import { useQuery } from "@tanstack/react-query";
import { lookupItem } from "../../../api/lookup";
import ProjectIndicatorTargetsDataEntryForm from "./ProjectIndicatorTargetsDataEntryForm";
import { getResultChainIndicatorByProjectId } from "../../../api/result-chain-indicator";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);

const ProjectIndicatorTargetsForm = ({
  processLevelItemId,
  processLevelTypeId,
  projectLocationId,
  year,
}) => {
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
    <Card mb={6} sx={{ minWidth: "1000px" }}>
      <CardContent>
        <Grid container spacing={12} sx={{ minWidth: "1000px" }}>
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
        <Grid container spacing={2} sx={{ minWidth: "1000px" }}>
          <Grid item md={12}>
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
              <Grid item md={1}>
                &nbsp;
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12}>
            <ProjectIndicatorTargetsDataEntryForm
              isLoadingResultChainIndicators={isLoadingResultChainIndicators}
              isErrorResultChainIndicators={isErrorResultChainIndicators}
              resultChainIndicators={resultChainIndicators}
              processLevelItemId={processLevelItemId}
              processLevelTypeId={processLevelTypeId}
              projectLocationId={projectLocationId}
              year={year}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default ProjectIndicatorTargetsForm;
