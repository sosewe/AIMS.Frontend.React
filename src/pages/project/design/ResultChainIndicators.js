import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteResultChainIndicator,
  getResultChainIndicatorsByResultChainId,
} from "../../../api/result-chain-indicator";
import {
  Button as MuiButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import React, { useState } from "react";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { Edit as EditIcon } from "@mui/icons-material";
import { purple, grey } from "@mui/material/colors";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DisaggregatesModal from "./DisaggregatesModal";
import AddIndicatorModal from "./AddIndicatorModal";
import AttributesModal from "./AttributesModal";

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
  outcome,
}) => {
  const [openDisaggregatesModal, setOpenDisaggregatesModal] = useState(false);
  const [openAttributesModal, setOpenAttributesModal] = useState(false);
  const [openDeleteResultChainModal, setDeleteResultChainModal] =
    useState(false);
  const [resultChainIndicatorId, setResultChainIndicatorId] = useState();
  const [indicatorAggregates, setIndicatorAggregates] = useState([]);
  const [indicatorAttributeTypes, setIndicatorAttributeTypes] = useState([]);
  const [openIndicatorModal, setOpenIndicatorModal] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: resultChainData,
    isLoading: isLoadingResultChainData,
    isError: isErrorResultChainData,
  } = useQuery(
    ["getResultChainIndicatorsByResultChainId", outcomeId],
    getResultChainIndicatorsByResultChainId,
    { enabled: !!outcomeId }
  );
  const { refetch } = useQuery(
    ["deleteResultChainIndicator", resultChainIndicatorId],
    deleteResultChainIndicator,
    { enabled: false }
  );
  if (isLoadingResultChainData || isErrorResultChainData) {
    return ``;
  }

  const handleClick = () => {
    setOpenDisaggregatesModal(false);
  };

  function handleCloseDeleteResultIndicator() {
    setDeleteResultChainModal(false);
  }

  const handleDeleteResultChainIndicator = async () => {
    await refetch();
    setDeleteResultChainModal(false);
    await queryClient.invalidateQueries([
      "getResultChainIndicatorsByResultChainId",
    ]);
  };

  const handleClickIndicatorModal = () => {};

  return (
    <>
      {resultChainData.data.map((resultChain) => (
        <Grid container spacing={2} key={Math.random().toString(36)}>
          <Grid item md={8}>
            <Typography variant="h6">
              {resultChain && resultChain.indicator
                ? resultChain.indicator.name
                : ""}
            </Typography>
          </Grid>
          <Grid item md={2}>
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
            <Link
              component="button"
              variant="h6"
              onClick={() => {
                setOpenAttributesModal(true);
                setResultChainIndicatorId(resultChain.id);
                setIndicatorAttributeTypes(
                  resultChain.indicator.indicatorAttributeTypes
                );
              }}
            >
              Attributes
            </Link>
          </Grid>
          <Grid item md={2}>
            <ThemeProvider theme={theme}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="secondaryGray"
                  onClick={() => {
                    setOpenIndicatorModal(true);
                    setResultChainIndicatorId(resultChain.id);
                  }}
                >
                  <EditIcon />
                </Button>
                <Button
                  variant="contained"
                  color="secondaryGray"
                  onClick={() => {
                    setDeleteResultChainModal(true);
                    setResultChainIndicatorId(resultChain.id);
                  }}
                >
                  <DeleteIcon />
                </Button>
              </Stack>
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
            indicatorAttributeTypes={indicatorAttributeTypes}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={openAttributesModal}
        onClose={() => setOpenAttributesModal(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>Attributes</DialogTitle>
        <Divider />
        <DialogContent>
          <AttributesModal
            resultChainIndicatorId={resultChainIndicatorId}
            processLevelItemId={processLevelItemId}
            processLevelTypeId={processLevelTypeId}
            indicatorAttributeTypes={indicatorAttributeTypes}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={openDeleteResultChainModal}
        onClose={() => setDeleteResultChainModal(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>Delete Indicator</DialogTitle>
        <Divider />
        <DialogContent>
          Are you sure you want to delete indicator?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDeleteResultChainIndicator()}
            color="primary"
          >
            Yes
          </Button>
          <Button
            onClick={() => handleCloseDeleteResultIndicator()}
            color="error"
            autoFocus
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={openIndicatorModal}
        onClose={() => setOpenIndicatorModal(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <AddIndicatorModal
            processLevelItemId={processLevelItemId}
            handleClick={handleClickIndicatorModal}
            outcome={outcome}
            resultChainIndicatorId={resultChainIndicatorId}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => setOpenIndicatorModal(false)}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default ResultChainIndicators;
