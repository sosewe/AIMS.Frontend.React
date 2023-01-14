import React from "react";
import styled from "@emotion/styled";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Link,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { Helmet } from "react-helmet-async";
import { NavLink } from "react-router-dom";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);
const TextField = styled(MuiTextField)(spacing);

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
    </React.Fragment>
  );
};
export default ProjectIndicatorTargets;
