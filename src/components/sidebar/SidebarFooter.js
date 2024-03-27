import React from "react";
import styled from "@emotion/styled";

import { Badge, Grid, Avatar, Typography } from "@mui/material";
import useKeyCloakAuth from "../../hooks/useKeyCloakAuth";
// import { useMsal } from "@azure/msal-react";

const Footer = styled.div`
  background-color: ${(props) =>
    props.theme.sidebar.footer.background} !important;
  padding: ${(props) => props.theme.spacing(2.75)}
    ${(props) => props.theme.spacing(4)};
  border-right: 1px solid rgba(0, 0, 0, 0.12);
`;

const FooterText = styled(Typography)`
  color: ${(props) => props.theme.sidebar.footer.color};
`;

const FooterSubText = styled(Typography)`
  color: ${(props) => props.theme.sidebar.footer.color};
  font-size: 0.7rem;
  display: block;
  padding: 1px;
`;

const FooterBadge = styled(Badge)`
  margin-right: ${(props) => props.theme.spacing(1)};
  span {
    background-color: ${(props) =>
      props.theme.sidebar.footer.online.background};
    border: 1.5px solid ${(props) => props.theme.palette.common.white};
    height: 12px;
    width: 12px;
    border-radius: 50%;
  }
`;

const SidebarFooter = ({ ...rest }) => {
  const user = useKeyCloakAuth();
  const userRoles = user?.roles;
  const userLevel = user?.tokenParsed.UserLevel;

  let roleString = "";
  if (userRoles && userRoles.length > 0) {
    roleString = userRoles.join(",");
  }

  return (
    <Footer {...rest}>
      <Grid container spacing={2}>
        <Grid item>
          <FooterBadge
            overlap="circular"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            variant="dot"
          >
            {/*{!!user && <Avatar alt={user.name} />}*/}
          </FooterBadge>
        </Grid>
        <Grid item>
          {!!user && (
            <>
              <FooterText variant="body2">
                {userLevel} : {roleString}
              </FooterText>
            </>
          )}
          {/*<FooterSubText variant="caption">UX Designer</FooterSubText>*/}
        </Grid>
      </Grid>
    </Footer>
  );
};

export default SidebarFooter;
