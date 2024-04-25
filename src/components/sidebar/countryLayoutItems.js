import { Home } from "react-feather";
import YardIcon from "@mui/icons-material/Yard";
import PublicIcon from "@mui/icons-material/Public";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import MarginOutlinedIcon from "@mui/icons-material/MarginOutlined";

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
        icon: YardIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Country Research",
        href: "",
        icon: PublicIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Country Level DCA",
        href: "/country-level-dca",
        icon: LeaderboardOutlinedIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Country Performance Report YTD",
        href: "/country-performance-report",
        icon: MarginOutlinedIcon,
      },
    ],
  },
];

export default navItems;
