import React from "react";
import styled from "@emotion/styled";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardHeader as MuiCardHeader,
  Divider as MuiDivider,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { Helmet } from "react-helmet-async";
import { NavLink, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getThematicArea } from "../../api/thematic-area";
import { getUniqueProgrammesByThematicAreaId } from "../../api/programme-thematic-area-sub-theme";
import { toast } from "react-toastify";
import { getAllSubThemesByThematicAreaId } from "../../api/thematic-area-sub-theme";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const CardHeader = styled(MuiCardHeader)(spacing);

const ViewThematicAreaCard = () => {
  let { id } = useParams();
  const {
    data: ThematicAreaData,
    isLoading,
    error,
    isError,
  } = useQuery(["getThematicArea", id], getThematicArea, {
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
  const {
    data: programmesData,
    isLoading: isLoadingProgrammes,
    isError: isErrorProgrammes,
    error: errorProgrammes,
  } = useQuery(
    ["getUniqueProgrammesByThematicAreaId", id],
    getUniqueProgrammesByThematicAreaId,
    {
      enabled: !!id,
    }
  );
  const {
    data: subThemesData,
    isLoading: isLoadingSubThemes,
    isError: isErrorSubThemes,
    error: errorSubThemes,
  } = useQuery(
    ["getAllSubThemesByThematicAreaId", id],
    getAllSubThemesByThematicAreaId,
    {
      enabled: !!id,
    }
  );
  if (isErrorProgrammes) {
    toast(errorProgrammes.response.data, {
      type: "error",
    });
  }
  if (isError) {
    toast(error.response.data, {
      type: "error",
    });
  }
  if (isErrorSubThemes) {
    toast(errorSubThemes.response.data, {
      type: "error",
    });
  }
  return (
    <Grid container spacing={2}>
      <Grid item md={12}>
        <Card mb={6}>
          <CardHeader title="Thematic Area" />
          <CardContent pb={1}>
            <Grid container spacing={2}>
              <Grid item md={4}>
                <strong>
                  Name: {!isLoading ? ThematicAreaData.data.name : ""}
                </strong>
              </Grid>
              <Grid item md={4}>
                <strong>
                  Initials: {!isLoading ? ThematicAreaData.data.initial : ""}
                </strong>
              </Grid>
              <Grid item md={4}>
                <strong>
                  Code: {!isLoading ? ThematicAreaData.data.code : ""}
                </strong>
              </Grid>
              <Grid item md={12}>
                <strong>
                  Description:
                  {!isLoading ? ThematicAreaData.data.description : ""}
                </strong>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={12}>
        <Card mb={6}>
          <CardHeader title="Programme(s) Linked to Thematic Area" />
          <CardContent pb={1}>
            <Grid container spacing={2}>
              <Grid item md={3}>
                <strong>Name</strong>
              </Grid>
              <Grid item md={3}>
                <strong>Initials</strong>
              </Grid>
              <Grid item md={3}>
                <strong>Code</strong>
              </Grid>
              <Grid item md={3}>
                <strong>Description</strong>
              </Grid>
            </Grid>
            {!isLoadingProgrammes &&
              programmesData.data.map((programme) => (
                <Grid container spacing={2} key={programme.id}>
                  <Grid item md={3}>
                    {programme.name}
                  </Grid>
                  <Grid item md={3}>
                    {programme.initials}
                  </Grid>
                  <Grid item md={3}>
                    {programme.code}
                  </Grid>
                  <Grid item md={3}>
                    {programme.description}
                  </Grid>
                </Grid>
              ))}
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={12}>
        <Card mb={6}>
          <CardHeader title="SubTheme(s) Linked to Thematic Area" />
          <CardContent pb={1}>
            <Grid container spacing={2}>
              <Grid item md={3}>
                <strong>Name</strong>
              </Grid>
              <Grid item md={3}>
                <strong>Initials</strong>
              </Grid>
              <Grid item md={3}>
                <strong>Code</strong>
              </Grid>
              <Grid item md={3}>
                <strong>Description</strong>
              </Grid>
            </Grid>
            {!isLoadingSubThemes &&
              subThemesData.data.map((subTheme) => (
                <Grid container spacing={2} key={subTheme.id}>
                  <Grid item md={3}>
                    {subTheme.name}
                  </Grid>
                  <Grid item md={3}>
                    {subTheme.initials}
                  </Grid>
                  <Grid item md={3}>
                    {subTheme.code}
                  </Grid>
                  <Grid item md={3}>
                    {subTheme.description}
                  </Grid>
                </Grid>
              ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
const ViewThematicArea = () => {
  return (
    <React.Fragment>
      <Helmet title="View Thematic Area" />
      <Typography variant="h3" gutterBottom display="inline">
        View Thematic Area
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/programme/thematic-areas">
          View Thematic Area
        </Link>
        <Typography>Thematic Areas List</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <ViewThematicAreaCard />
    </React.Fragment>
  );
};
export default ViewThematicArea;
