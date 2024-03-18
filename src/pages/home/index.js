import React, { useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Breadcrumbs, Divider, Link, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { UserLevelContext } from "../../App";

const CorporateDashboard = () => {
  return (
    <React.Fragment>
      <Helmet title="Corporate Dashboard" />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Typography variant="h3" gutterBottom display="inline">
          Corporate Dashboard
        </Typography>
        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
          <Link component={NavLink} to="/">
            QLIK Boards
          </Link>
          <Typography>Data Streams</Typography>
        </Breadcrumbs>
        <Divider my={6} />

        <iframe
          title="Project Summary"
          width="100%"
          height="100%"
          mt="5"
          src="https://qlik.amref.org:8443/single/?appid=14a1e3eb-8df8-4d3f-a1ed-8a608d45ef75&sheet=6931ed03-c2d1-4ea6-aa74-1b801a0aa2f8&theme=breeze&opt=ctxmenu,currsel"
          frameBorder="0"
          allowFullScreen="true"
        ></iframe>
      </LocalizationProvider>
    </React.Fragment>
  );
};

const ProgrammeDashboard = () => {
  return (
    <React.Fragment>
      <Helmet title="Corporate Dashboard" />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Typography variant="h3" gutterBottom display="inline">
          Programme Dashboard
        </Typography>
        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
          <Link component={NavLink} to="/">
            QLIK Boards
          </Link>
          <Typography>Data Streams</Typography>
        </Breadcrumbs>
        <Divider my={6} />

        <iframe
          title="Project Summary"
          width="100%"
          height="100%"
          mt="5"
          src="https://qlik.amref.org:8443/single/?appid=14a1e3eb-8df8-4d3f-a1ed-8a608d45ef75&sheet=6931ed03-c2d1-4ea6-aa74-1b801a0aa2f8&theme=breeze&opt=ctxmenu,currsel"
          frameBorder="0"
          allowFullScreen="true"
        ></iframe>
      </LocalizationProvider>
    </React.Fragment>
  );
};

const CountryDashboard = () => {
  return (
    <React.Fragment>
      <Helmet title="Corporate Dashboard" />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Typography variant="h3" gutterBottom display="inline">
          Country Dashboard
        </Typography>
        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
          <Link component={NavLink} to="/">
            QLIK Boards
          </Link>
          <Typography>Data Streams</Typography>
        </Breadcrumbs>
        <Divider my={6} />

        <iframe
          title="Project Summary"
          width="100%"
          height="100%"
          mt="5"
          src="https://qlik.amref.org:8443/single/?appid=14a1e3eb-8df8-4d3f-a1ed-8a608d45ef75&sheet=6931ed03-c2d1-4ea6-aa74-1b801a0aa2f8&theme=breeze&opt=ctxmenu,currsel"
          frameBorder="0"
          allowFullScreen="true"
        ></iframe>
      </LocalizationProvider>
    </React.Fragment>
  );
};

const ProjectDashboard = () => {
  return (
    <React.Fragment>
      <Helmet title="Corporate Dashboard" />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Typography variant="h3" gutterBottom display="inline">
          Project Dashboard
        </Typography>
        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
          <Link component={NavLink} to="/">
            QLIK Boards
          </Link>
          <Typography>Data Streams</Typography>
        </Breadcrumbs>
        <Divider my={6} />

        <iframe
          title="Project Summary"
          width="100%"
          height="100%"
          mt="5"
          src="https://qlik.amref.org:8443/single/?appid=14a1e3eb-8df8-4d3f-a1ed-8a608d45ef75&sheet=6931ed03-c2d1-4ea6-aa74-1b801a0aa2f8&theme=breeze&opt=ctxmenu,currsel"
          frameBorder="0"
          allowFullScreen="true"
        ></iframe>
      </LocalizationProvider>
    </React.Fragment>
  );
};

const DashboardDataByUserType = () => {
  const userLevelContext = useContext(UserLevelContext);

  switch (userLevelContext) {
    case "Project":
      return <ProjectDashboard />;
    case "Corporate":
      return <CorporateDashboard />;
    case "Country":
      return <CountryDashboard />;
    case "Programme":
      return <ProgrammeDashboard />;
    default:
      return <ProjectDashboard />;
  }
};

const Home = () => {
  return (
    <React.Fragment>
      <Helmet title="Dashboard" />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DashboardDataByUserType />
      </LocalizationProvider>
    </React.Fragment>
  );
};

export default Home;
