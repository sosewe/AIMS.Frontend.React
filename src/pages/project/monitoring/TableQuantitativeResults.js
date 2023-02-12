import React from "react";
import { Helmet } from "react-helmet-async";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Grid,
  Link,
  Paper as MuiPaper,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import styled from "@emotion/styled";
import { NavLink, useParams } from "react-router-dom";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Paper = styled(MuiPaper)(spacing);

const TableQuantitativeResultsGrid = () => {
  return (
    <Card mb={6}>
      <Paper>
        <Grid container>
          <Grid item md={3}>
            MONTH
          </Grid>
          <Grid item md={3}>
            HAS TARGETS
          </Grid>
          <Grid item md={3}>
            DATA PRESENCE
          </Grid>
          <Grid item md={3}>
            ENTER DATA
          </Grid>
        </Grid>
      </Paper>
    </Card>
  );
};
const TableQuantitativeResults = () => {
  let { processLevelItemId, processLevelTypeId } = useParams();

  return (
    <React.Fragment>
      <Helmet title="Reporting Period" />
      <Typography variant="h3" gutterBottom display="inline">
        Results Framework
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link
          component={NavLink}
          to={`/project/design-project/${processLevelItemId}/${processLevelTypeId}`}
        >
          Project Design
        </Link>
        <Typography>Project Quantitative Result Framework</Typography>
      </Breadcrumbs>
      <Divider my={6} />
      <TableQuantitativeResultsGrid />
    </React.Fragment>
  );
};
export default TableQuantitativeResults;
