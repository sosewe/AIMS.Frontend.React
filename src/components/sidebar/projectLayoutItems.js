import { Home } from "react-feather";
// import PublicIcon from "@mui/icons-material/Public";
import WorkspacesOutlinedIcon from "@mui/icons-material/WorkspacesOutlined";

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
        title: "Projects List",
        href: "/project-home",
        icon: WorkspacesOutlinedIcon,
      },
    ],
  },
  // {
  //   title: "",
  //   pages: [
  //     {
  //       title: "Advocacy",
  //       href: "",
  //       icon: PublicIcon,
  //     },
  //   ],
  // },
  // {
  //   title: "",
  //   pages: [
  //     {
  //       title: "Innovation",
  //       href: "",
  //       icon: PublicIcon,
  //     },
  //   ],
  // },
  // {
  //   title: "",
  //   pages: [
  //     {
  //       title: "TA",
  //       href: "",
  //       icon: PublicIcon,
  //     },
  //   ],
  // },
];

export default navItems;
