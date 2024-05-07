import WorkspacesOutlinedIcon from "@mui/icons-material/WorkspacesOutlined";
import { Home, Tag } from "react-feather";
import MemoryOutlinedIcon from "@mui/icons-material/MemoryOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import TurnedInNotOutlinedIcon from "@mui/icons-material/TurnedInNotOutlined";
import TextureOutlinedIcon from "@mui/icons-material/TextureOutlined";

const navItems = [
  {
    title: "",
    pages: [
      {
        title: "Country Dashboard",
        href: "/",
        icon: Home,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Country Strategy",
        href: "",
        icon: WorkspacesOutlinedIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Corporate Advocacies",
        href: "/advocacy-monitoring-home",
        icon: TextureOutlinedIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Corporate Innovations",
        href: "/innovation-monitoring-home",
        icon: MemoryOutlinedIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Corporate Researches",
        href: "/research-monitoring-home",
        icon: TurnedInNotOutlinedIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Corporate Technical Assistance",
        href: "/technical-assistance-monitoring-home",
        icon: BuildOutlinedIcon,
      },
    ],
  },
];

export default navItems;
