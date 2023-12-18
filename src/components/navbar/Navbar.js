import React, { useContext } from "react";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
import { darken } from "polished";
import { Search as SearchIcon } from "react-feather";
import { useTranslation } from "react-i18next";

import {
  Grid,
  InputBase,
  AppBar as MuiAppBar,
  IconButton as MuiIconButton,
  Toolbar,
  Typography,
} from "@mui/material";

import { Menu as MenuIcon, Title } from "@mui/icons-material";

import NavbarNotificationsDropdown from "./NavbarNotificationsDropdown";
import NavbarMessagesDropdown from "./NavbarMessagesDropdown";
import NavbarLanguagesDropdown from "./NavbarLanguagesDropdown";
import NavbarUserDropdown from "./NavbarUserDropdown";
import useKeyCloakAuth from "../../hooks/useKeyCloakAuth";
import OfficeSelect from "../../pages/home/OfficeSelect";
import { OfficeContext } from "../../App";

const AppBar = styled(MuiAppBar)`
  background: ${(props) => props.theme.header.background};
  color: ${(props) => props.theme.header.color};
`;

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const Search = styled.div`
  border-radius: 2px;
  background-color: ${(props) => props.theme.header.background};
  display: none;
  position: relative;
  width: 100%;

  &:hover {
    background-color: ${(props) => darken(0.05, props.theme.header.background)};
  }

  ${(props) => props.theme.breakpoints.up("md")} {
    display: block;
  }
`;

const SearchIconWrapper = styled.div`
  width: 50px;
  height: 100%;
  position: absolute;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 22px;
    height: 22px;
  }
`;

const Input = styled(InputBase)`
  color: inherit;
  width: 100%;

  > input {
    color: ${(props) => props.theme.header.search.color};
    padding-top: ${(props) => props.theme.spacing(2.5)};
    padding-right: ${(props) => props.theme.spacing(2.5)};
    padding-bottom: ${(props) => props.theme.spacing(2.5)};
    padding-left: ${(props) => props.theme.spacing(12)};
    width: 160px;
  }
`;

const Navbar = ({ onDrawerToggle }) => {
  const { t } = useTranslation();
  const user = useKeyCloakAuth();
  console.log(user);
  const officeContext = useContext(OfficeContext);
  const selectedOffice = officeContext.selectedOffice;

  return (
    <React.Fragment>
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <Grid container alignItems="center" spacing={2}>
            <Typography variant="h2" color="white" fontWeight="bold">
              Amref Information Management System
            </Typography>
            <Grid item sx={{ display: { xs: "block", md: "none" } }}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={onDrawerToggle}
                size="large"
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item>
              {/*<Search>*/}
              {/*  <SearchIconWrapper>*/}
              {/*    <SearchIcon />*/}
              {/*  </SearchIconWrapper>*/}
              {/*  <Input placeholder={t("Search")} />*/}
              {/*</Search>*/}
            </Grid>
            <Grid item xs />
            <Grid item>
              {!!user && (
                <Typography variant="body1" color="white" gutterBottom>
                  Welcome, {user.name}
                </Typography>
              )}
            </Grid>
            <Grid item>
              <Typography variant="h5" gutterBottom>
                {selectedOffice ? selectedOffice : ""}
              </Typography>
            </Grid>
            <Grid item>
              <OfficeSelect />
              {/*<NavbarMessagesDropdown />*/}
              {/*<NavbarNotificationsDropdown />*/}
              {/*<NavbarLanguagesDropdown />*/}
              <NavbarUserDropdown />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default withTheme(Navbar);
