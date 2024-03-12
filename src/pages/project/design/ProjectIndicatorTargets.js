import React from "react";
import styled from "@emotion/styled";
import {
  AppBar,
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  Divider as MuiDivider,
  Toolbar,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import ProjectIndicatorTargetsForm from "./ProjectIndicatorTargetsForm";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const ProjectIndicatorTargets = () => {
  let { processLevelItemId, processLevelTypeId, projectLocationId, year } =
    useParams();
  const navigate = useNavigate();
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  return (
    <React.Fragment>
      <Helmet title="Results Framework: Indicator Targets" />
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
          Results Framework: Indicator Targets
        </Typography>

        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
          <Typography>
            Project Quantitative Result Framework: Indicator Targets
          </Typography>
        </Breadcrumbs>
        <Divider my={6} />
        <ProjectIndicatorTargetsForm
          processLevelItemId={processLevelItemId}
          processLevelTypeId={processLevelTypeId}
          projectLocationId={projectLocationId}
          year={year}
        />
      </Box>
    </React.Fragment>
  );
};
export default ProjectIndicatorTargets;
