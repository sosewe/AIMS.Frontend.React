import React, { useEffect } from "react";
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
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const NewThematicArea = () => {
  return (
    <React.Fragment>
      <Helmet title="New Thematic Area" />
      <Typography variant="h3" gutterBottom display="inline">
        New Thematic Area
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/programme/sub-themes">
          Thematic Area
        </Link>
        <Typography>New Thematic Area</Typography>
      </Breadcrumbs>

      <Divider my={6} />
    </React.Fragment>
  );
};
export default NewThematicArea;
