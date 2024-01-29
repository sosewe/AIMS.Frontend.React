import React, { useState } from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useNavigate } from "react-router-dom";
import DesignProject from "../project/design/DesignProject";
import ProjectMonitoring from "../project/monitoring/ProjectMonitoring";
const ProjectAccess = () => {
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
        return <DesignProject />;
      case "monitoring":
        return <ProjectMonitoring />;
      case "reports":
        return null;
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <ThemeProvider theme={darkTheme} enableColorOnDark>
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
export default ProjectAccess;
