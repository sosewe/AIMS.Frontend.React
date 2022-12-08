import React from "react";
import { Helmet } from "react-helmet-async";
import styled from "@emotion/styled";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { NavLink, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { getProjectById } from "../../../api/project";
import { toast } from "react-toastify";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);

const ProjectView = () => {
  let { id } = useParams();
  const { isLoading, data, error } = useQuery(
    ["getProjectById", id],
    getProjectById,
    {
      enabled: !!id,
    }
  );
  if (error) {
    toast(error.response.data, {
      type: "error",
    });
  }
  return (
    <Card mb={12}>
      <CardContent pb={1}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" gutterBottom>
              {!isLoading ? data.data.projectCode : ""}
              <br />
              {!isLoading ? data.data.longTitle : ""}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Link
              component={NavLink}
              to="/project/design-project/"
              color="indianred"
              variant="h3"
            >
              Design
            </Link>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              Project Start Date:
              {!isLoading
                ? format(new Date(data.data.startingDate), "dd-MMM-yyyy")
                : ""}
            </Typography>
            <Typography variant="body2">
              Project End Date:
              {!isLoading
                ? format(new Date(data.data.endingDate), "dd-MMM-yyyy")
                : ""}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Link
              component={NavLink}
              to="/project/projects"
              color="indianred"
              variant="h3"
            >
              Monitoring
            </Link>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const ProjectDetail = () => {
  return (
    <React.Fragment>
      <Helmet title="Project Detail" />
      <Typography variant="h3" gutterBottom display="inline">
        Project Detail
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/project/projects">
          Projects
        </Link>
        <Typography>Project Detail</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <ProjectView />
    </React.Fragment>
  );
};

export default ProjectDetail;
