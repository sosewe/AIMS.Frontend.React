import React from "react";

import async from "./components/Async";

// All pages that rely on 3rd party components (other than MUI) are
// loaded asynchronously, to keep the initial JS bundle to a minimum size

// Layouts
import AuthLayout from "./layouts/Auth";
import DashboardLayout from "./layouts/Dashboard";
import ProjectLayout from "./layouts/ProjectLayout";

// import PresentationLayout from "./layouts/Presentation";
import DynamicLayout from "./layouts/DynamicLayout";

// Guards
import AuthGuard from "./components/guards/AuthGuard";

// Auth components
import Page404 from "./pages/auth/Page404";
import Page500 from "./pages/auth/Page500";

// Landing
// import Landing from "./pages/presentation/Landing";

// Home
import Home from "./pages/home";
import ProjectAccess from "./pages/home/ProjectAccess";
import NewAttributeResponseOption from "./pages/attributes/NewAttributeResponseOption";
import ProjectHome from "./pages/home/ProjectHome";

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
const LookupOrders = async(() =>
  import("./pages/lookup-master-items/LookupOrders")
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
const ProjectIndicatorTargetsView = async(() =>
  import("./pages/project/design/ProjectIndicatorTargetsView")
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
const NewProgramme = async(() => import("./pages/programmes/NewProgramme"));
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

// Innovation Design
const Innovation = async(() =>
  import("./pages/project/design/Innovation/Innovation")
);
const NewInnovation = async(() =>
  import("./pages/project/design/Innovation/NewInnovation")
);
const InnovationDetail = async(() =>
  import("./pages/project/design/Innovation/InnovationDetail")
);

// Innovation Monitoring
const InnovationResults = async(() =>
  import("./pages/project/monitoring/InnovationV2/InnovationResults")
);

const InnovationMonitoring = async(() =>
  import("./pages/project/monitoring/Innovation/InnovationMonitoring")
);

const InnovationMonitoringDetail = async(() =>
  import("./pages/project/monitoring/InnovationV2/InnovationDetail")
);

//Advocacy Monitoring
const AdvocacyResults = async(() =>
  import("./pages/project/monitoring/Advocacy/AdvocacyResults")
);

const AdvocacyMonitoring = async(() =>
  import("./pages/project/monitoring/Advocacy/AdvocacyMonitoring")
);

const AdvocacyMonitoringDetail = async(() =>
  import("./pages/project/monitoring/Advocacy/AdvocacyDetail")
);
const AdvocacyMonitoringKMDocumentsUpload = async(() =>
  import("./pages/project/monitoring/Advocacy/KMDocumentsUpload")
);

const AdvocacyMonitoringUpdate = async(() =>
  import("./pages/project/monitoring//Advocacy/AdvocacyUpdate")
);

// Technical Assistance Monitoring
const TechnicalAssistanceResults = async(() =>
  import(
    "./pages/project/monitoring/TechnicalAssistance/TechnicalAssistanceResults"
  )
);

const TechnicalAssistanceMonitoring = async(() =>
  import(
    "./pages/project/monitoring/TechnicalAssistance/TechnicalAssistanceMonitoring"
  )
);

const TechnicalAssistanceMonitoringDetail = async(() =>
  import(
    "./pages/project/monitoring/TechnicalAssistance/TechnicalAssistanceDetail"
  )
);

const TechnicalAssistanceMonitoringMonthlyUpdate = async(() =>
  import("./pages/project/monitoring//TechnicalAssistance/MonthlyUpdate")
);

const TechnicalAssistanceMonitoringQuarterlyUpdate = async(() =>
  import("./pages/project/monitoring//TechnicalAssistance/QuarterlyUpdate")
);

const TechnicalAssistanceMonitoringKMDocumentsUpload = async(() =>
  import("./pages/project/monitoring//TechnicalAssistance/KMDocumentsUpload")
);

// Learning Design
const Learning = async(() =>
  import("./pages/project/design/Learning/Learning")
);
const NewLearning = async(() =>
  import("./pages/project/design/Learning/NewLearning")
);
const LearningDetail = async(() =>
  import("./pages/project/design/Learning/LearningDetail")
);
const LearningResults = async(() =>
  import("./pages/project/monitoring/Learning/LearningResults")
);

const LearningMonitoring = async(() =>
  import("./pages/project/monitoring/Learning/LearningMonitoring")
);

const NewAdvocacy = async(() =>
  import("./pages/project/design/Advocacy/NewAdvocacy")
);
const AdvocacyDetail = async(() =>
  import("./pages/project/design/Advocacy/AdvocacyDetail")
);
const NewAdvocacyObjective = async(() =>
  import("./pages/project/design/Advocacy/NewAdvocacyObjective")
);

const EditAdvocacyObjective = async(() =>
  import("./pages/project/design/Advocacy/EditAdvocacyObjective")
);

// TechnicalAssistance
const TechnicalAssistance = async(() =>
  import("./pages/project/design/TechnicalAssistance/TechnicalAssistance")
);
const NewTechnicalAssistance = async(() =>
  import("./pages/project/design/TechnicalAssistance/NewTechnicalAssistance")
);
const TechnicalAssistanceDetail = async(() =>
  import("./pages/project/design/TechnicalAssistance/TechnicalAssistanceDetail")
);

const ProjectRoles = async(() => import("./pages/project-role/ProjectRoles"));
const NewProjectRole = async(() =>
  import("./pages/project-role/NewProjectRole")
);

// Attributes
const AttributesList = async(() => import("./pages/attributes/AttributesList"));
const NewAttribute = async(() => import("./pages/attributes/NewAttribute"));
const ViewAttribute = async(() => import("./pages/attributes/ViewAttribute"));

//Roles
const Roles = async(() => import("./pages/admin/Roles"));
const Modules = async(() => import("./pages/admin/Modules"));
const Pages = async(() => import("./pages/admin/Pages"));
const NewModule = async(() => import("./pages/admin/NewModule"));
const NewPage = async(() => import("./pages/admin/NewPage"));
const NewAction = async(() => import("./pages/admin/NewAction"));
// Aggregate - Disaggregate
const Aggregate = async(() => import("./pages/aggregate/Aggregate"));
const NewAggregate = async(() => import("./pages/aggregate/NewAggregate"));
const ViewAggregate = async(() => import("./pages/aggregate/ViewAggregate"));
const DisAggregatesList = async(() =>
  import("./pages/dis-aggregates/DisAggregatesList")
);
const NewDisAggregate = async(() =>
  import("./pages/dis-aggregates/NewDisAggregate")
);
const CountryLevelDCA = async(() =>
  import("./pages/project/reports/CountryLevelDCA")
);

const routes = [
  {
    path: "/",
    element: (
      <AuthGuard>
        <DynamicLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "project-home",
        element: <ProjectHome />,
      },
      {
        path: "country-level-dca",
        element: <CountryLevelDCA />,
      },
      {
        path: "country-performance-report",
      },
    ],
  },
  {
    path: "project-access",
    element: <ProjectLayout />,
    children: [
      {
        path: ":id/:processLevelTypeId",
        element: <ProjectAccess />,
      },
      {
        path: "project-indicator-targets/:processLevelItemId/:processLevelTypeId/:projectLocationId/:year",
        element: <ProjectIndicatorTargets />,
      },
      {
        path: "project-indicator-targets-view/:processLevelItemId/:processLevelTypeId/:projectLocationId/:year",
        element: <ProjectIndicatorTargetsView />,
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
        path: "project-detail/:id",
        element: <ProjectDetail />,
      },
      {
        path: "monitoring/innovation-results/:processLevelItemId/:processLevelTypeId/:innovationId/:projectLocationId/:reportingPeriod/:year",
        element: <InnovationResults />,
      },
      {
        path: "monitoring/technicalassistance-results/:processLevelItemId/:processLevelTypeId/:technicalAssistanceId/:projectLocationId/:reportingPeriod/:year",
        element: <TechnicalAssistanceResults />,
      },
      {
        path: "monitoring/advocacy-results/:processLevelItemId/:processLevelTypeId/:advocacyId/:projectLocationId/:reportingPeriod/:year",
        element: <AdvocacyResults />,
      },
      {
        path: "monitoring/learning-results/:processLevelItemId/:processLevelTypeId/:learningId/:projectLocationId/:reportingPeriod/:year",
        element: <LearningResults />,
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
        path: "new-programme",
        element: <NewProgramme />,
      },
      {
        path: "new-programme/:id",
        element: <NewProgramme />,
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
      {
        path: "attributes-list",
        element: <AttributesList />,
      },
      {
        path: "new-attribute",
        element: <NewAttribute />,
      },
      {
        path: "new-attribute/:id",
        element: <NewAttribute />,
      },
      {
        path: "view-attribute/:id",
        element: <ViewAttribute />,
      },
      {
        path: "new-attribute-response-option/:attributeTypeId",
        element: <NewAttributeResponseOption />,
      },
      {
        path: "new-attribute-response-option/:attributeTypeId/:id",
        element: <NewAttributeResponseOption />,
      },
      {
        path: "aggregates",
        element: <Aggregate />,
      },
      {
        path: "new-aggregate",
        element: <NewAggregate />,
      },
      {
        path: "new-aggregate/:id",
        element: <NewAggregate />,
      },
      {
        path: "view-aggregate/:id",
        element: <ViewAggregate />,
      },
      {
        path: "dis-aggregates",
        element: <DisAggregatesList />,
      },
      {
        path: "new-dis-aggregate",
        element: <NewDisAggregate />,
      },
      {
        path: "new-dis-aggregate/:id",
        element: <NewDisAggregate />,
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
        path: "project-indicator-targets-view/:processLevelItemId/:processLevelTypeId/:projectLocationId/:year",
        element: <ProjectIndicatorTargetsView />,
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
        path: "design/innovation/new-innovation/:processLevelItemId/:processLevelTypeId",
        element: <NewInnovation />,
      },
      {
        path: "design/innovation/innovation-detail/:id",
        element: <InnovationDetail />,
      },
      {
        path: "monitoring/innovation-monitoring/:processLevelItemId/:processLevelTypeId/:id",
        element: <InnovationMonitoring />,
      },
      {
        path: "monitoring/innovation-monitoring-detail/:id",
        element: <InnovationMonitoringDetail />,
      },
      {
        path: "monitoring/technical-assistance-monitoring/:processLevelItemId/:processLevelTypeId/:id",
        element: <TechnicalAssistanceMonitoring />,
      },
      {
        path: "monitoring/technical-assistance-monitoring-detail/:id",
        element: <TechnicalAssistanceMonitoringDetail />,
      },
      {
        path: "monitoring/technical-assistance-monitoring-monthly-update/:id",
        element: <TechnicalAssistanceMonitoringMonthlyUpdate />,
      },
      {
        path: "monitoring/technical-assistance-monitoring-monthly-update/:id/:editId",
        element: <TechnicalAssistanceMonitoringMonthlyUpdate />,
      },
      {
        path: "monitoring/technical-assistance-monitoring-quarterly-update/:id",
        element: <TechnicalAssistanceMonitoringQuarterlyUpdate />,
      },
      {
        path: "monitoring/technical-assistance-monitoring-quarterly-update/:id/:editId",
        element: <TechnicalAssistanceMonitoringQuarterlyUpdate />,
      },
      {
        path: "monitoring/technical-assistance-monitoring-documents-upload/:id",
        element: <TechnicalAssistanceMonitoringKMDocumentsUpload />,
      },
      {
        path: "monitoring/technical-assistance-monitoring-documents-upload/:id/:editId",
        element: <TechnicalAssistanceMonitoringKMDocumentsUpload />,
      },
      {
        path: "monitoring/advocacy-monitoring/:processLevelItemId/:processLevelTypeId/:id",
        element: <AdvocacyMonitoring />,
      },
      {
        path: "design/technical-assistance/technical-assistance/:processLevelItemId/:processLevelTypeId",
        element: <TechnicalAssistance />,
      },
      {
        path: "design/technical-assistance/new-technical-assistance/:processLevelItemId/:processLevelTypeId",
        element: <NewTechnicalAssistance />,
      },
      {
        path: "design/technical-assistance/technical-assistance-detail/:id",
        element: <TechnicalAssistanceDetail />,
      },
      {
        path: "design/learning/learning-detail/:id",
        element: <LearningDetail />,
      },
      {
        path: "design/learning/learning/:processLevelItemId/:processLevelTypeId",
        element: <Learning />,
      },
      {
        path: "design/learning/new-learning/:processLevelItemId/:processLevelTypeId",
        element: <NewLearning />,
      },
      {
        path: "design/advocacy/new-advocacy/:processLevelItemId/:processLevelTypeId",
        element: <NewAdvocacy />,
      },
      {
        path: "design/advocacy/advocacy-detail/:id",
        element: <AdvocacyDetail />,
      },
      {
        path: "design/advocacy/new-advocacy-objective/:id",
        element: <NewAdvocacyObjective />,
      },
      {
        path: "design/advocacy/edit-advocacy-objective/:id/:editId",
        element: <EditAdvocacyObjective />,
      },
      {
        path: "monitoring/advocacy-monitoring-detail/:id",
        element: <AdvocacyMonitoringDetail />,
      },
      {
        path: "monitoring/advocacy-monitoring-documents-upload/:id",
        element: <AdvocacyMonitoringKMDocumentsUpload />,
      },
      {
        path: "monitoring/advocacy-monitoring-documents-upload/:id/:editId",
        element: <AdvocacyMonitoringKMDocumentsUpload />,
      },
      {
        path: "monitoring/advocacy-monitoring-update/:id",
        element: <AdvocacyMonitoringUpdate />,
      },
      {
        path: "monitoring/advocacy-monitoring-update/:id/:editId",
        element: <AdvocacyMonitoringUpdate />,
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
        path: "lookupOrders",
        element: <LookupOrders />,
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
      {
        path: "project-roles",
        element: <ProjectRoles />,
      },
      {
        path: "new-project-role",
        element: <NewProjectRole />,
      },
      {
        path: "new-project-role/:id",
        element: <NewProjectRole />,
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
    path: "admin",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "role-permissions",
        element: <Roles />,
        permission: "role-permission",
      },
      {
        path: "modules",
        element: <Modules />,
      },
      {
        path: "pages",
        element: <Pages />,
      },
      {
        path: "new-module",
        element: <NewModule />,
      },
      {
        path: "new-page/:moduleId",
        element: <NewPage />,
      },
      {
        path: "new-page/:moduleId/:pageId",
        element: <NewPage />,
      },
      {
        path: "new-action/:pageId",
        element: <NewAction />,
      },
      {
        path: "new-action/:pageId/:actionId",
        element: <NewAction />,
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
