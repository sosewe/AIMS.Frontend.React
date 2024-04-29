import React, { useContext, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Outlet } from "react-router-dom";

import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Paper as MuiPaper,
  Toolbar,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { spacing } from "@mui/system";

import GlobalStyle from "../components/GlobalStyle";
import Navbar from "../components/navbar/Navbar";
import guestDashboardItems from "../components/sidebar/guestLayoutItems";
import projectDashboardItems from "../components/sidebar/projectLayoutItems";
import countryDashboardItems from "../components/sidebar/countryLayoutItems";
import countryLayoutMonitoringItems from "../components/sidebar/countryLayoutMonitoringItems";
import countryLayoutReportingItems from "../components/sidebar/countryLayoutReportingItems";
import corporateDashboardItems from "../components/sidebar/corporateItems";
import corporateMonitoringItems from "../components/sidebar/corporateMonitoringItems";
import corporateReportingItems from "../components/sidebar/corporateReportingItems";
import programmeDashboardItems from "../components/sidebar/programmeItems";
import Sidebar from "../components/sidebar/Sidebar";
import Footer from "../components/Footer";
import { UserLevelContext } from "../App";

const drawerWidth = 258;

const Root = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Drawer = styled.div`
  ${(props) => props.theme.breakpoints.up("md")} {
    width: ${drawerWidth}px;
    flex-shrink: 0;
  }
`;

const AppContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 100%;
`;

const Paper = styled(MuiPaper)(spacing);

const MainContent = styled(Paper)`
  flex: 1;
  background: ${(props) => props.theme.palette.background.default};

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    flex: none;
  }

  .MuiPaper-root .MuiPaper-root {
    box-shadow: none;
  }
`;

const DynamicLayout = ({ children }) => {
  const userLevelContext = useContext(UserLevelContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dashboardItems, setDashboardItems] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  // State to track the selected link
  const [selectedLink, setSelectedLink] = useState("design");

  useEffect(() => {
    function setLayout() {
      switch (userLevelContext) {
        case "Project":
          setDashboardItems(projectDashboardItems);
          break;
        case "Corporate":
          switch (selectedLink) {
            case "design":
              setDashboardItems(corporateDashboardItems);
              break;
            case "monitoring":
              setDashboardItems(corporateMonitoringItems);
              break;
            case "reports":
              setDashboardItems(corporateReportingItems);
              break;
            default:
              setDashboardItems(corporateDashboardItems);
              break;
          }
          break;
        case "Country":
          switch (selectedLink) {
            case "design":
              setDashboardItems(countryDashboardItems);
              break;
            case "monitoring":
              setDashboardItems(countryLayoutMonitoringItems);
              break;
            case "reports":
              setDashboardItems(countryLayoutReportingItems);
              break;
            default:
              setDashboardItems(countryDashboardItems);
              break;
          }
          break;
        case "Programme":
          setDashboardItems(programmeDashboardItems);
          break;
        default:
          setDashboardItems(guestDashboardItems);
          break;
      }
    }
    setLayout();
  }, [userLevelContext, selectedLink]);

  const handleLinkClick = (link) => {
    setSelectedLink(link);
  };

  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      <Drawer>
        <Box sx={{ display: { xs: "block", lg: "none" } }}>
          <Sidebar
            PaperProps={{ style: { width: drawerWidth } }}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            items={dashboardItems}
          />
        </Box>
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Sidebar
            PaperProps={{ style: { width: drawerWidth } }}
            items={dashboardItems}
          />
        </Box>
      </Drawer>
      <AppContent>
        <Navbar onDrawerToggle={handleDrawerToggle} />
        <MainContent p={isLgUp ? 5 : 5}>
          <ThemeProvider theme={darkTheme}>
            <AppBar
              position="static"
              color="secondary"
              sx={{ marginBottom: 2 }}
            >
              <Toolbar>
                <Button
                  color={selectedLink === "design" ? "primary" : "secondary"}
                  onClick={() => handleLinkClick("design")}
                >
                  Design
                </Button>

                {/* Monitoring link in the middle */}
                <Typography
                  variant="h6"
                  style={{ flex: 1, textAlign: "center" }}
                >
                  <Button
                    color={
                      selectedLink === "monitoring" ? "primary" : "secondary"
                    }
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
          {children}
          <Outlet />
        </MainContent>
        <Footer />
      </AppContent>
      {/*<Settings />*/}
    </Root>
  );
};
export default DynamicLayout;
