import { Home } from "react-feather";
import YardIcon from "@mui/icons-material/Yard";
import PublicIcon from "@mui/icons-material/Public";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import MarginOutlinedIcon from "@mui/icons-material/MarginOutlined";
import WorkspacesOutlinedIcon from "@mui/icons-material/WorkspacesOutlined";

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
        title: "Country Advocacies",
        href: "",
        icon: YardIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Country Innovations",
        href: "",
        icon: PublicIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Country Researches",
        href: "",
        icon: LeaderboardOutlinedIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Country TA",
        href: "",
        icon: MarginOutlinedIcon,
      },
    ],
  },
];

export default navItems;
