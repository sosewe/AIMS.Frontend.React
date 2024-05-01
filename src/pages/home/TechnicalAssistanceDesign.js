import React, { useState } from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useNavigate, useParams } from "react-router-dom";
import TechnicalAssistanceDetail from "../project/design/TechnicalAssistance/TechnicalAssistanceDetail";

const TechnicalAssistanceDesign = () => {
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
          <TechnicalAssistanceDetail
            id={id}
            processLevelTypeId={processLevelTypeId}
          />
        );

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
          </Toolbar>
        </AppBar>
      </ThemeProvider>
      <Box my={6}>{renderComponent()}</Box>
    </React.Fragment>
  );
};
export default TechnicalAssistanceDesign;
