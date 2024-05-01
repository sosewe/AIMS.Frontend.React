import React, { useState } from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useNavigate, useParams } from "react-router-dom";
import ProjectMonitoring from "../project/monitoring/ProjectMonitoring";
import ProjectReports from "../project/reports/ProjectReports";
import DesignLearning from "../project/design/Learning/DesignLearning";

const ResearchAccess = () => {
  let { id, processLevelTypeId } = useParams();
  const navigate = useNavigate();
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  // State to track the selected link
  const [selectedLink, setSelectedLink] = useState("design");

  // Function to handle link selection
  const handleLinkClick = (link) => {
    setSelectedLink(link);
  };

  // Function to render the appropriate component based on the selected link
  const renderComponent = () => {
    switch (selectedLink) {
      case "design":
        return (
          <DesignLearning id={id} processLevelTypeId={processLevelTypeId} />
        );
      case "monitoring":
        return (
          <ProjectMonitoring
            id={id}
            processLevelTypeId={processLevelTypeId}
            event={4}
          />
        );
      case "reports":
        return <ProjectReports />;
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <ThemeProvider theme={darkTheme}>
        <AppBar position="static" color="secondary">
          <Toolbar>
            <Button
              color={selectedLink === "home" ? "primary" : "inherit"}
              onClick={() => navigate("/")}
              style={{ marginRight: "16px" }}
            >
              <HomeOutlinedIcon />
            </Button>

            <Button
              color={selectedLink === "design" ? "primary" : "secondary"}
              onClick={() => handleLinkClick("design")}
            >
              Design
            </Button>

            {/* Monitoring link in the middle */}
            <Typography variant="h6" style={{ flex: 1, textAlign: "center" }}>
              <Button
                color={selectedLink === "monitoring" ? "primary" : "secondary"}
                onClick={() => handleLinkClick("monitoring")}
                style={{ marginLeft: "16px" }}
              >
                Monitoring
              </Button>
            </Typography>

            {/* Reports link on the right */}
            <Button
              color={selectedLink === "reports" ? "primary" : "secondary"}
              onClick={() => handleLinkClick("reports")}
              style={{ marginLeft: "auto" }}
            >
              Reports
            </Button>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
      <Box my={6}>{renderComponent()}</Box>
    </React.Fragment>
  );
};
export default ResearchAccess;
