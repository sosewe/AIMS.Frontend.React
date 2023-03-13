import React from "react";

import async from "./components/Async";

// All pages that rely on 3rd party components (other than MUI) are
// loaded asynchronously, to keep the initial JS bundle to a minimum size

// Layouts
import AuthLayout from "./layouts/Auth";
import DashboardLayout from "./layouts/Dashboard";
// import DocLayout from "./layouts/Doc";
// import PresentationLayout from "./layouts/Presentation";

// Guards
import AuthGuard from "./components/guards/AuthGuard";

// Auth components
import Page404 from "./pages/auth/Page404";
import Page500 from "./pages/auth/Page500";

// Landing
// import Landing from "./pages/presentation/Landing";

// Home
import Home from "./pages/home";

// Lookup
const LookupItem = async(() => import("./pages/lookup/LookupItem"));
const NewLookupItem = async(() => import("./pages/lookup/NewLookupItem"));
const LookupMasters = async(() =>
  import("./pages/lookup-master/LookupMasters")
);
const NewLookupMaster = async(() =>
  import("./pages/lookup-master/NewLookupMaster")
);
const LookupMasterItems = async(() =>
  import("./pages/lookup-master-items/LookupMasterItems")
);

// Project
const Projects = async(() => import("./pages/project/design/Projects"));
const NewProject = async(() => import("./pages/project/design/NewProject"));
const ProjectDetail = async(() =>
  import("./pages/project/design/ProjectDetail")
);
const DesignProject = async(() =>
  import("./pages/project/design/DesignProject")
);
const EnterTargetQuantitativeResultsFramework = async(() =>
  import("./pages/project/design/EnterTargetQuantitativeResultsFramework")
);
const ProjectIndicatorTargets = async(() =>
  import("./pages/project/design/ProjectIndicatorTargets")
);

// Administrative Programmes
const AdministrativeProgrammes = async(() =>
  import("./pages/administrative-programmes/AdministrativeProgrammes")
);
const NewAdministrativeProgramme = async(() =>
  import("./pages/administrative-programmes/NewAdministrativeProgramme")
);
// Programmes
const Programmes = async(() => import("./pages/programmes/Programmes"));
const ViewProgramme = async(() => import("./pages/programmes/ViewProgramme"));
// Thematic Areas
const ThematicAreas = async(() =>
  import("./pages/thematic-areas/ThematicAreas")
);
const NewThematicArea = async(() =>
  import("./pages/thematic-areas/NewThematicArea")
);
const ViewThematicArea = async(() =>
  import("./pages/thematic-areas/ViewThematicArea")
);
// Sub Themes
const SubThemes = async(() => import("./pages/sub-themes/SubThemes"));
const NewSubTheme = async(() => import("./pages/sub-themes/NewSubTheme"));
// Donors
const Donors = async(() => import("./pages/donor/Donors"));
const NewDonor = async(() => import("./pages/donor/NewDonor"));
// Organization Units
const OrganizationUnits = async(() => import("./pages/organization-units"));
const NewOrganizationUnit = async(() =>
  import("./pages/organization-units/NewOrganizationUnit")
);
// Entities
const Entities = async(() => import("./pages/entities/Entities"));
const NewEntity = async(() => import("./pages/entities/NewEntity"));
// Indicators
const Indicators = async(() => import("./pages/indicators/Indicators"));
const NewIndicator = async(() => import("./pages/indicators/NewIndicator"));
const AdministrativeUnits = async(() =>
  import("./pages/administrative-units/AdministrativeUnits")
);
const NewAdministrativeUnit = async(() =>
  import("./pages/administrative-units/NewAdministrativeUnit")
);
const ProjectMonitoring = async(() =>
  import("./pages/project/monitoring/ProjectMonitoring")
);
const TableQuantitativeResults = async(() =>
  import("./pages/project/monitoring/TableQuantitativeResults")
);
const EnterQuantitativeResults = async(() =>
  import("./pages/project/monitoring/EnterQuantitativeResults")
);
const Innovation = async(() =>
  import("./pages/project/design/Innovation/Innovation")
);
const Advocacy = async(() =>
  import("./pages/project/design/Advocacy/Advocacy")
);

const routes = [
  {
    path: "/",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
    ],
  },
  {
    path: "programme",
    element: <DashboardLayout />,
    children: [
      {
        path: "programmes",
        element: <Programmes />,
      },
      {
        path: "view-programme/:id",
        element: <ViewProgramme />,
      },
      {
        path: "administrative-programmes",
        element: <AdministrativeProgrammes />,
      },
      {
        path: "new-administrative-programme",
        element: <NewAdministrativeProgramme />,
      },
      {
        path: "new-administrative-programme/:id",
        element: <NewAdministrativeProgramme />,
      },
      {
        path: "thematic-areas",
        element: <ThematicAreas />,
      },
      {
        path: "new-thematic-area",
        element: <NewThematicArea />,
      },
      {
        path: "new-thematic-area/:id",
        element: <NewThematicArea />,
      },
      {
        path: "view-thematic-area/:id",
        element: <ViewThematicArea />,
      },
      {
        path: "sub-themes",
        element: <SubThemes />,
      },
      {
        path: "new-sub-theme",
        element: <NewSubTheme />,
      },
      {
        path: "new-sub-theme/:id",
        element: <NewSubTheme />,
      },
    ],
  },
  {
    path: "indicator",
    element: <DashboardLayout />,
    children: [
      {
        path: "indicators",
        element: <Indicators />,
      },
      {
        path: "new-indicator",
        element: <NewIndicator />,
      },
      {
        path: "new-indicator/:id",
        element: <NewIndicator />,
      },
    ],
  },
  {
    path: "project",
    element: <DashboardLayout />,
    children: [
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "new-project",
        element: <NewProject />,
      },
      {
        path: "new-project/:id",
        element: <NewProject />,
      },
      {
        path: "project-detail/:id",
        element: <ProjectDetail />,
      },
      {
        path: "design-project/:id/:processLevelTypeId",
        element: <DesignProject />,
      },
      {
        path: "enter-target-quantitative-results-framework/:processLevelItemId/:processLevelTypeId",
        element: <EnterTargetQuantitativeResultsFramework />,
      },
      {
        path: "project-indicator-targets/:processLevelItemId/:processLevelTypeId/:projectLocationId/:year",
        element: <ProjectIndicatorTargets />,
      },
      {
        path: "monitoring/project-monitoring/:processLevelItemId/:processLevelTypeId",
        element: <ProjectMonitoring />,
      },
      {
        path: "monitoring/table-quantitative-results/:processLevelItemId/:processLevelTypeId/:projectLocationId/:year",
        element: <TableQuantitativeResults />,
      },
      {
        path: "monitoring/enter-quantitative-results/:processLevelItemId/:processLevelTypeId/:projectLocationId/:monthId/:year",
        element: <EnterQuantitativeResults />,
      },
      {
        path: "new-innovation/:processLevelItemId/:processLevelTypeId",
        element: <Innovation />,
      },
      {
        path: "new-innovation/:processLevelItemId/:processLevelTypeId/:id",
        element: <Innovation />,
      },
      {
        path: "new-advocacy/:processLevelItemId/:processLevelTypeId",
        element: <Advocacy />,
      },
    ],
  },
  {
    path: "lookup",
    element: <DashboardLayout />,
    children: [
      {
        path: "lookupItem",
        element: <LookupItem />,
      },
      {
        path: "new-lookupItem",
        element: <NewLookupItem />,
      },
      {
        path: "new-lookupItem/:id",
        element: <NewLookupItem />,
      },
      {
        path: "lookupMasters",
        element: <LookupMasters />,
      },
      {
        path: "new-lookup-master",
        element: <NewLookupMaster />,
      },
      {
        path: "new-lookup-master/:id",
        element: <NewLookupMaster />,
      },
      {
        path: "lookupMasterItems",
        element: <LookupMasterItems />,
      },
    ],
  },
  {
    path: "settings",
    element: <DashboardLayout />,
    children: [
      {
        path: "entities",
        element: <Entities />,
      },
      {
        path: "new-entity",
        element: <NewEntity />,
      },
      {
        path: "new-entity/:id",
        element: <NewEntity />,
      },
      {
        path: "organization-units",
        element: <OrganizationUnits />,
      },
      {
        path: "new-organization-unit",
        element: <NewOrganizationUnit />,
      },
      {
        path: "new-organization-unit/:id",
        element: <NewOrganizationUnit />,
      },
      {
        path: "donors",
        element: <Donors />,
      },
      {
        path: "new-donor",
        element: <NewDonor />,
      },
      {
        path: "new-donor/:id",
        element: <NewDonor />,
      },
      {
        path: "administrative-units",
        element: <AdministrativeUnits />,
      },
      {
        path: "new-administrative-unit",
        element: <NewAdministrativeUnit />,
      },
      {
        path: "new-administrative-unit/:id",
        element: <NewAdministrativeUnit />,
      },
    ],
  },
  {
    path: "projects",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <Projects />,
      },
    ],
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        path: "404",
        element: <Page404 />,
      },
      {
        path: "500",
        element: <Page500 />,
      },
    ],
  },
  {
    path: "*",
    element: <AuthLayout />,
    children: [
      {
        path: "*",
        element: <Page404 />,
      },
    ],
  },
];

export default routes;
