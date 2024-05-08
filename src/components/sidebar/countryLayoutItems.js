import { Home, Tag } from "react-feather";
import YardIcon from "@mui/icons-material/Yard";
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
        icon: YardIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Country Projects",
        href: "/project-home",
        icon: Tag,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Country Advocacies",
        href: "/advocacy-design-home",
        icon: TextureOutlinedIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Country Innovations",
        href: "/innovation-design-home",
        icon: MemoryOutlinedIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Country Researches",
        href: "/research-design-home",
        icon: TurnedInNotOutlinedIcon,
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        title: "Country Technical Assistance",
        href: "/technical-assistance-design-home",
        icon: BuildOutlinedIcon,
      },
    ],
  },
];

export default navItems;
