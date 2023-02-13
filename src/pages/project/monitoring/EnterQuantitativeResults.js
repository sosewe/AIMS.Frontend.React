import React from "react";
import { Helmet } from "react-helmet-async";
import styled from "@emotion/styled";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Link,
  Paper as MuiPaper,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { NavLink, useParams } from "react-router-dom";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Paper = styled(MuiPaper)(spacing);

const EnterQuantitativeResults = () => {
  let {
    processLevelItemId,
    processLevelTypeId,
    projectLocationId,
    monthId,
    year,
  } = useParams();
  return (
    <React.Fragment>
      <Helmet title="Enter Data" />
      <Typography variant="h3" gutterBottom display="inline">
        Results Framework
      </Typography>
      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link
          component={NavLink}
          to={`/project/project-detail/${processLevelItemId}`}
        >
          Project Detail
        </Link>
        <Link
          component={NavLink}
          to={`/project/monitoring/table-quantitative-results/${processLevelItemId}/${processLevelTypeId}/${projectLocationId}/${year}`}
        >
          Reporting Period
        </Link>
        <Typography>Enter Data</Typography>
      </Breadcrumbs>
      <Divider my={6} />
    </React.Fragment>
  );
};
export default EnterQuantitativeResults;
