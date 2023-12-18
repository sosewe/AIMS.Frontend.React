import { Home } from "react-feather";
import YardIcon from "@mui/icons-material/Yard";
import PublicIcon from "@mui/icons-material/Public";

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
];

export default navItems;
