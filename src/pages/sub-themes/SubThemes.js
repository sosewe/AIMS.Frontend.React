import React, { useState } from "react";
import styled from "@emotion/styled";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  FormControl as MuiFormControl,
  Link,
  Paper as MuiPaper,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { Helmet } from "react-helmet-async";
import { NavLink } from "react-router-dom";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);
const FormControl = styled(MuiFormControl)(spacing);

const SubThemes = () => {
  return (
    <React.Fragment>
      <Helmet title="Sub Themes" />
      <Typography variant="h3" gutterBottom display="inline">
        Sub Themes
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/programme/administrative-programmes">
          Sub Themes
        </Link>
        <Typography>Sub Themes List</Typography>
      </Breadcrumbs>

      <Divider my={6} />
    </React.Fragment>
  );
};
export default SubThemes;
