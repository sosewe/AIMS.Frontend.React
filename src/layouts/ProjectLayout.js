import React, { useContext, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Outlet } from "react-router-dom";

import { CssBaseline, Paper as MuiPaper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { spacing } from "@mui/system";

import GlobalStyle from "../components/GlobalStyle";
import Navbar from "../components/navbar/Navbar";
import projectDashboardItems from "../components/sidebar/projectLayoutItems";
import countryDashboardItems from "../components/sidebar/countryLayoutItems";
import corporateDashboardItems from "../components/sidebar/corporateItems";
import Footer from "../components/Footer";
import Settings from "../components/Settings";
import { UserLevelContext } from "../App";

const Root = styled.div`
  display: flex;
  min-height: 100vh;
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

const ProjectLayout = ({ children }) => {
  const userLevelContext = useContext(UserLevelContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dashboardItems, setDashboardItems] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  useEffect(() => {
    function setLayout() {
      switch (userLevelContext) {
        case "Project":
          setDashboardItems(projectDashboardItems);
          break;
        case "Corporate":
          setDashboardItems(corporateDashboardItems);
          break;
        case "Country":
          setDashboardItems(countryDashboardItems);
          break;
        default:
          setDashboardItems(projectDashboardItems);
          break;
      }
    }
    setLayout();
  }, [userLevelContext]);
  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      <AppContent>
        <Navbar onDrawerToggle={handleDrawerToggle} />
        <MainContent p={isLgUp ? 12 : 5}>
          {children}
          <Outlet />
        </MainContent>
        <Footer />
      </AppContent>
      <Settings />
    </Root>
  );
};
export default ProjectLayout;
