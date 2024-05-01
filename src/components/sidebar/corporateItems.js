import { Home, Tag } from "react-feather";
import YardIcon from "@mui/icons-material/Yard";
import PublicIcon from "@mui/icons-material/Public";
import BarChartIcon from "@mui/icons-material/BarChart";
import SummarizeIcon from "@mui/icons-material/Summarize";
import MemoryOutlinedIcon from "@mui/icons-material/MemoryOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import TurnedInNotOutlinedIcon from "@mui/icons-material/TurnedInNotOutlined";
import TextureOutlinedIcon from "@mui/icons-material/TextureOutlined";
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
        title: "Country Offices",
        href: "",
        icon: PublicIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Corporate Strategy",
        href: "/corporate-strategy",
        icon: YardIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Corporate Projects",
        href: "/project-home",
        icon: Tag,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Corporate Advocacies",
        href: "/advocacy-design-home",
        icon: TextureOutlinedIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Corporate Innovations",
        href: "/innovation-design-home",
        icon: MemoryOutlinedIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Corporate Researches",
        href: "/research-design-home",
        icon: TurnedInNotOutlinedIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Corporate Technical Assistance",
        href: "/technical-assistance-design-home",
        icon: BuildOutlinedIcon,
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
