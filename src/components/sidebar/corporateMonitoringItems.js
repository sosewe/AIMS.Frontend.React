import { Home, Tag } from "react-feather";
import YardIcon from "@mui/icons-material/Yard";
import PublicIcon from "@mui/icons-material/Public";
import BarChartIcon from "@mui/icons-material/BarChart";
import SummarizeIcon from "@mui/icons-material/Summarize";
import SettingsBrightnessOutlinedIcon from "@mui/icons-material/SettingsBrightnessOutlined";

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
        title: "Corporate Advocacies",
        href: "",
        icon: SummarizeIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Corporate Innovations",
        href: "",
        icon: Tag,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Corporate Researches",
        href: "",
        icon: YardIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Corporate TA's",
        href: "",
        icon: BarChartIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Administration",
        href: "/programme",
        icon: SettingsBrightnessOutlinedIcon,
      },
    ],
  },
];

export default navItems;
