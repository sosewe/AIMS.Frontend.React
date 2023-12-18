import { Home } from "react-feather";
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
        href: "/",
        icon: Home,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Corporate Strategy",
        href: "",
        icon: YardIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Global Narrative Reports",
        href: "",
        icon: PublicIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Country Performance YTD",
        href: "",
        icon: BarChartIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Global DCA Summary",
        href: "",
        icon: SummarizeIcon,
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
