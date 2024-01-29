import { Home } from "react-feather";
import YardIcon from "@mui/icons-material/Yard";
import PublicIcon from "@mui/icons-material/Public";

const navItems = [
  {
    title: "",
    pages: [
      {
        title: "Project Dashboard",
        href: "/",
        icon: Home,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Project Basic Information",
        href: "",
        icon: YardIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Advocacy",
        href: "",
        icon: PublicIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Innovation",
        href: "",
        icon: PublicIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "TA",
        href: "",
        icon: PublicIcon,
      },
    ],
  },
];

export default navItems;
