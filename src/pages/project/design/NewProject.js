import React from "react";
import { Helmet } from "react-helmet-async";
import styled from "@emotion/styled";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Link,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { NavLink } from "react-router-dom";
import NewProjectForm from "./NewProjectForm";

const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const NewProject = () => {
  return (
    <React.Fragment>
      <Helmet title="New Project" />
      <Typography variant="h3" gutterBottom display="inline">
        New Project
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/project/new-project">
          Projects
        </Link>
        <Typography>New Project</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <NewProjectForm />
    </React.Fragment>
  );
};

export default NewProject;
