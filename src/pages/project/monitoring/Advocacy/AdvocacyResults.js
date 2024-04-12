import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  AppBar,
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CircularProgress,
  Divider as MuiDivider,
  Grid,
  Link,
  MenuItem,
  Paper as MuiPaper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField as MuiTextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import styled from "@emotion/styled";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AdvocacyDetail from "./AdvocacyDetail";
import { getInnovationByMonitoringPeriod } from "../../../../api/innovation";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Paper = styled(MuiPaper)(spacing);

const AdvocacyResultsGrid = () => {
  let {
    processLevelItemId,
    processLevelTypeId,
    advocacyId,
    projectLocationId,
    reportingPeriod,
    year,
  } = useParams();
  return (
    <React.Fragment>
      <AdvocacyDetail
        processLevelItemId={processLevelItemId}
        processLevelTypeId={processLevelTypeId}
        advocacyId={advocacyId}
        projectLocationId={projectLocationId}
        reportingPeriod={reportingPeriod}
        year={year}
      />
    </React.Fragment>
  );
};
const AdvocacyResults = () => {
  let {
    processLevelItemId,
    processLevelTypeId,
    advocacyId,
    projectLocationId,
    reportingPeriod,
    year,
  } = useParams();

  console.log("useParams()  ...  " + JSON.stringify(useParams()));

  const navigate = useNavigate();
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  return (
    <React.Fragment>
      <Helmet title="Reporting Period" />
      <ThemeProvider theme={darkTheme} enableColorOnDark>
        <AppBar position="static" color="secondary">
          <Toolbar>
            <Button
              color={"inherit"}
              onClick={() => navigate("/")}
              style={{ marginRight: "16px" }}
            >
              <HomeOutlinedIcon />
            </Button>
            <Button
              color={"primary"}
              onClick={() =>
                navigate(
                  `/project-access/${processLevelItemId}/${processLevelTypeId}`
                )
              }
            >
              Design
            </Button>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
      <Box my={6}>
        <Typography variant="h3" gutterBottom display="inline">
          Advocacy Monitoring
        </Typography>

        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
          <Link
            component={NavLink}
            to={`/project-access/${processLevelItemId}/${processLevelTypeId}`}
          >
            Project Design
          </Link>
          <Typography>Monitoring</Typography>
        </Breadcrumbs>
        <Divider my={2} />
        <AdvocacyResultsGrid
          processLevelItemId={processLevelItemId}
          processLevelTypeId={processLevelTypeId}
          advocacyId={advocacyId}
          projectLocationId={projectLocationId}
          reportingPeriod={reportingPeriod}
          year={year}
        />
      </Box>
    </React.Fragment>
  );
};
export default AdvocacyResults;
