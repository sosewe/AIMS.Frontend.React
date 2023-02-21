import React from "react";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Grid,
  Paper as MuiPaper,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const Paper = styled(MuiPaper)(spacing);

const Advocacy = () => {
  return (
    <Card mb={12}>
      <CardContent>
        <Grid container spacing={12}>
          <Grid item md={12}>
            <Typography variant="h3" gutterBottom display="inline">
              Advocacy
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default Advocacy;
