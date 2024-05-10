import { Home, Tag } from "react-feather";
import YardIcon from "@mui/icons-material/Yard";
import PublicIcon from "@mui/icons-material/Public";
import BarChartIcon from "@mui/icons-material/BarChart";
import SummarizeIcon from "@mui/icons-material/Summarize";
import SettingsBrightnessOutlinedIcon from "@mui/icons-material/SettingsBrightnessOutlined";
import RollerShadesClosedOutlinedIcon from "@mui/icons-material/RollerShadesClosedOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";

const navItems = [
  {
    title: "",
    pages: [
      {
        title: "Corporate Dashboard",
        href: "",
        icon: Home,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Global Indicator Reports",
        href: "/global-indicator-report",
        icon: BarChartIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Project Performance Summary By Country",
        href: "",
        icon: TrendingUpOutlinedIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Global Narrative Reports",
        href: "/global-narrative-report",
        icon: YardIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Global DCA Summary",
        href: "/global-summary",
        icon: SummarizeIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Researches By Country",
        href: "",
        icon: SettingsBrightnessOutlinedIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Advocacies By Country",
        href: "",
        icon: Tag,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Innovations By Country",
        href: "",
        icon: PublicIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "TA By Country",
        href: "",
        icon: RollerShadesClosedOutlinedIcon,
      },
    ],
  },
];

export default navItems;
