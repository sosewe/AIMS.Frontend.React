import {
  Shuffle,
  Layers,
  Clipboard,
  Settings,
  Slack,
  Home,
} from "react-feather";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";

const projectSection = [
  {
    href: "/project",
    icon: Layers,
    title: "Project",
    children: [
      {
        href: "/project/projects",
        title: "Projects",
      },
    ],
  },
];

const programmeSection = [
  {
    href: "/programme",
    icon: Clipboard,
    title: "Programmes",
    children: [
      {
        href: "/programme/programmes",
        title: "Programmes",
      },
      {
        href: "/programme/thematic-areas",
        title: "Thematic Areas",
      },
      {
        href: "/programme/sub-themes",
        title: "Sub Themes",
      },
      {
        href: "/programme/administrative-programmes",
        title: "Administrative Programmes",
      },
    ],
  },
  {
    href: "/indicator",
    icon: Slack,
    title: "Indicators",
    children: [
      {
        href: "/indicator/indicators",
        title: "Indicators",
      },
      {
        href: "/indicator/attributes-list",
        title: "Attributes",
      },
      {
        href: "/indicator/aggregate-disaggregate",
        title: "Aggregate/DisAggregate",
      },
    ],
  },
];

const configurationSection = [
  {
    href: "/lookup",
    icon: Shuffle,
    title: "Lookup",
    children: [
      {
        href: "/lookup/lookupMasterItems",
        title: "Lookup Master Items",
      },
      {
        href: "/lookup/lookupOrders",
        title: "Lookup Master Items-Ordered",
      },
      {
        href: "/lookup/lookupMasters",
        title: "Lookup Master",
      },
      {
        href: "/lookup/lookupItem",
        title: "Lookup Items",
      },
    ],
  },
  {
    href: "/settings",
    icon: Settings,
    title: "Settings",
    children: [
      {
        href: "/settings/entities",
        title: "Entities",
      },
      {
        href: "/settings/organization-units",
        title: "Organization Units",
      },
      {
        href: "/settings/donors",
        title: "Donors",
      },
      {
        href: "/settings/administrative-units",
        title: "Administrative Units",
      },
      {
        href: "/settings/project-roles",
        title: "Project Roles",
      },
    ],
  },
];

const administrationSection = [
  {
    href: "/admin",
    title: "Roles",
    icon: AdminPanelSettingsOutlinedIcon,
    children: [
      {
        href: "/admin/role-permissions",
        title: "Role Permissions",
      },
      {
        href: "/admin/modules",
        title: "Modules",
      },
      {
        href: "/admin/pages",
        title: "Pages",
      },
    ],
  },
];

const navItems = [
  {
    title: "",
    pages: [
      {
        title: "Dashboard",
        href: "/",
        icon: Home,
      },
    ],
  },
  {
    title: "Programmes",
    pages: programmeSection,
  },
  {
    title: "Projects",
    pages: projectSection,
  },
  {
    title: "Configuration",
    pages: configurationSection,
  },
  {
    title: "Administration",
    pages: administrationSection,
  },
];

export default navItems;
