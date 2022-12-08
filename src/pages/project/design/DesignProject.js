import * as React from "react";
import Divider from "@mui/material/Divider";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import ContentCut from "@mui/icons-material/ContentCut";
import ContentCopy from "@mui/icons-material/ContentCopy";
import ContentPaste from "@mui/icons-material/ContentPaste";
import Cloud from "@mui/icons-material/Cloud";
import styled from "@emotion/styled";
import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  Grid,
  Link,
  Paper,
} from "@mui/material";
import { spacing } from "@mui/system";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);

const DesignProject = () => {
  return (
    <Paper elevation={0} sx={{ width: "100%" }}>
      <Grid container>
        <Grid item md={3}>
          <Card>
            <CardContent pb={1}>
              <MenuList>
                <MenuItem>
                  <ListItemText>
                    <Link>Basic Information</Link>
                  </ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemText>
                    <Link>Geographic Focus</Link>
                  </ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemText>
                    <Link>Objectives</Link>
                  </ListItemText>
                </MenuItem>
              </MenuList>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={9}>
          <Card>
            <CardContent pb={1}>hhh</CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DesignProject;
