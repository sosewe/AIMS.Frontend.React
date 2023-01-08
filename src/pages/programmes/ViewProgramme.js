import React from "react";
import { Helmet } from "react-helmet-async";
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
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { NavLink, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProgramme } from "../../api/programmes";
import {
  getUniqueSubThemesByProgrammeId,
  GetUniqueThematicAreasByProgrammeId,
} from "../../api/programme-thematic-area-sub-theme";
import { toast } from "react-toastify";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const CardHeader = styled(MuiCardHeader)(spacing);

const ViewProgrammeCard = () => {
  let { id } = useParams();

  const {
    data: ProgrammeData,
    isLoading,
    isError,
    error,
  } = useQuery(["getProgramme", id], getProgramme, { enabled: !!id });

  const {
    data: ThematicAreasData,
    isLoading: isLoadingThematicAreasData,
    isError: isErrorThematicAreasData,
    error: errorThematicAreasData,
  } = useQuery(
    ["GetUniqueThematicAreasByProgrammeId", id],
    GetUniqueThematicAreasByProgrammeId,
    { enabled: !!id }
  );
  const {
    data: SubThemesData,
    isLoading: isLoadingSubThemesData,
    isError: isErrorSubThemesData,
    error: errorSubThemesData,
  } = useQuery(
    ["getUniqueSubThemesByProgrammeId", id],
    getUniqueSubThemesByProgrammeId,
    { enabled: !!id }
  );
  if (isErrorThematicAreasData) {
    toast(errorThematicAreasData.response.data, {
      type: "error",
    });
  }
  return (
    <Grid container spacing={2}>
      <Grid item md={12}>
        <Card mb={6}>
          <CardHeader title="Programme" />
          <CardContent pb={1}>
            <Grid container spacing={2}>
              <Grid item md={4}>
                <strong>
                  Name: {!isLoading ? ProgrammeData.data.name : ""}
                </strong>
              </Grid>
              <Grid item md={4}>
                <strong>
                  Initials: {!isLoading ? ProgrammeData.data.initials : ""}
                </strong>
              </Grid>
              <Grid item md={4}>
                <strong>
                  Code: {!isLoading ? ProgrammeData.data.code : ""}
                </strong>
              </Grid>
              <Grid item md={12}>
                <strong>
                  Description:
                  {!isLoading ? ProgrammeData.data.description : ""}
                </strong>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={12}>
        <Card mb={6}>
          <CardHeader title="Thematic Area(s) Linked to Programme" />
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
            {!isLoadingThematicAreasData &&
              ThematicAreasData.data.map((thematicArea) => (
                <Grid container spacing={2} key={thematicArea.id}>
                  <Grid item md={3}>
                    {thematicArea.name}
                  </Grid>
                  <Grid item md={3}>
                    {thematicArea.initial}
                  </Grid>
                  <Grid item md={3}>
                    {thematicArea.code}
                  </Grid>
                  <Grid item md={3}>
                    {thematicArea.description}
                  </Grid>
                </Grid>
              ))}
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={12}>
        <Card mb={6}>
          <CardHeader title="SubTheme(s) Linked to Programme" />
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
            {!isLoadingSubThemesData &&
              SubThemesData.data.map((subTheme) => (
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
const ViewProgramme = () => {
  return (
    <React.Fragment>
      <Helmet title="View Programme" />
      <Typography variant="h3" gutterBottom display="inline">
        View Programme
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/programme/programmes">
          View Programme
        </Link>
        <Typography>Programme List</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <ViewProgrammeCard />
    </React.Fragment>
  );
};
export default ViewProgramme;
