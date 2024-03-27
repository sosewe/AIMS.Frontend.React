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
        title: "Programme Dashboard",
        href: "/",
        icon: Home,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Programme Projects",
        href: "/processprojects",
        icon: Tag,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Programme Strategy",
        href: "/processstrategy",
        icon: YardIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Global Narrative Reports",
        href: "/globalreports",
        icon: PublicIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Country Performance YTD",
        href: "/countryperformance",
        icon: BarChartIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Global DCA Summary",
        href: "/globalsummary",
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
