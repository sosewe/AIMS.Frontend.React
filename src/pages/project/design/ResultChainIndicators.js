import { useQuery } from "@tanstack/react-query";
import { getResultChainIndicatorsByResultChainId } from "../../../api/result-chain-indicator";
import {
  Button as MuiButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import React, { useState } from "react";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { purple, grey } from "@mui/material/colors";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DisaggregatesModal from "./DisaggregatesModal";

const theme = createTheme({
  palette: {
    secondary: {
      main: purple[500],
    },
    secondaryGray: {
      main: grey[500],
    },
  },
});

const Button = styled(MuiButton)(spacing);

const ResultChainIndicators = ({
  outcomeId,
  processLevelItemId,
  processLevelTypeId,
}) => {
  const [openDisaggregatesModal, setOpenDisaggregatesModal] = useState(false);
  const [resultChainIndicatorId, setResultChainIndicatorId] = useState();
  const [indicatorAggregates, setIndicatorAggregates] = useState([]);
  const {
    data: resultChainData,
    isLoading: isLoadingResultChainData,
    isError: isErrorResultChainData,
  } = useQuery(
    ["getResultChainIndicatorsByResultChainId", outcomeId],
    getResultChainIndicatorsByResultChainId,
    { enabled: !!outcomeId }
  );
  if (isLoadingResultChainData || isErrorResultChainData) {
    return ``;
  }

  const handleClick = () => {
    setOpenDisaggregatesModal(false);
  };

  return (
    <>
      {resultChainData.data.map((resultChain) => (
        <Grid container spacing={2} key={Math.random().toString(36)}>
          <Grid item md={8}>
            <Typography variant="h6">
              {resultChain && resultChain.indicator
                ? "#" + resultChain.indicator.name
                : ""}
            </Typography>
          </Grid>
          <Grid item md={4}>
            <Link
              component="button"
              variant="h6"
              onClick={() => {
                setOpenDisaggregatesModal(true);
                setResultChainIndicatorId(resultChain.id);
                setIndicatorAggregates(
                  resultChain.indicator.indicatorAggregates
                );
              }}
            >
              Disaggregates
            </Link>
          </Grid>
          <Grid item md={2}>
            <ThemeProvider theme={theme}>
              <Button variant="contained" color="secondaryGray">
                <DeleteIcon />
              </Button>
            </ThemeProvider>
          </Grid>
        </Grid>
      ))}
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={openDisaggregatesModal}
        onClose={() => setOpenDisaggregatesModal(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>Disaggregates</DialogTitle>
        <Divider />
        <DialogContent>
          <DisaggregatesModal
            resultChainIndicatorId={resultChainIndicatorId}
            indicatorAggregates={indicatorAggregates}
            processLevelItemId={processLevelItemId}
            processLevelTypeId={processLevelTypeId}
            handleClick={handleClick}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
export default ResultChainIndicators;
