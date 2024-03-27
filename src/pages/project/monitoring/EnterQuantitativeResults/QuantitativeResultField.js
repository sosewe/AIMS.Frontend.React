import React, { useState } from "react";
import { Button, Dialog, DialogContent, Grid } from "@mui/material";
import ResultChainAggregateAttributeModal from "./ResultChainAggregateAttributeModal";
import ResultChainAggregateOnlyModal from "./ResultChainAggregateOnlyModal";
import ResultChainAttributeOnlyModal from "./ResultChainAttributeOnlyModal";
import ResultChainIndicatorModal from "./ResultChainIndicatorModal";

const QuantitativeResultField = ({
  resultChainIndicator,
  year,
  monthId,
  processLevelItemId,
  processLevelTypeId,
  projectLocationId,
  resultChainIndicators,
}) => {
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const handleClickOpen = (event, modType) => {
    setOpen(true);
    if (modType) {
      setModalType(modType);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="left"
      alignItems="left"
      spacing={6}
    >
      <Grid item md={12}>
        <Grid container spacing={2}>
          <Grid item md={3}>
            {resultChainIndicator.indicator.name}
          </Grid>
          <Grid item md={6}>
            {resultChainIndicator["resultChainAggregates"].length > 0 &&
            resultChainIndicator["resultChainAttributes"].length > 0 ? (
              <React.Fragment>
                <Button
                  variant="contained"
                  type="button"
                  onClick={(e) => handleClickOpen(e, "aggregateAttribute")}
                >
                  Link to enter actual by indicator
                </Button>
              </React.Fragment>
            ) : resultChainIndicator["resultChainAggregates"].length > 0 &&
              resultChainIndicator["resultChainAttributes"].length === 0 ? (
              <React.Fragment>
                <React.Fragment>
                  <Button
                    variant="contained"
                    type="button"
                    onClick={(e) => handleClickOpen(e, "aggregateOnly")}
                  >
                    Link to enter actual by indicator
                  </Button>
                </React.Fragment>
              </React.Fragment>
            ) : resultChainIndicator["resultChainAggregates"].length === 0 &&
              resultChainIndicator["resultChainAttributes"].length > 0 ? (
              <React.Fragment>
                <React.Fragment>
                  <Button
                    variant="contained"
                    type="button"
                    onClick={(e) => handleClickOpen(e, "attributesOnly")}
                  >
                    Link to enter actual by indicator
                  </Button>
                </React.Fragment>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Button
                  variant="contained"
                  type="button"
                  onClick={(e) => handleClickOpen(e, "indicatorField")}
                >
                  Link to enter actual by indicator
                </Button>
              </React.Fragment>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={12}>
        <Dialog
          fullWidth={true}
          open={open}
          onClose={handleClose}
          maxWidth="md"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            {modalType === "aggregateAttribute" && (
              <ResultChainAggregateAttributeModal
                resultChainAggregates={
                  resultChainIndicator["resultChainAggregates"]
                }
                resultChainAttributes={
                  resultChainIndicator["resultChainAttributes"][0]
                }
                year={year}
                monthId={monthId}
                processLevelItemId={processLevelItemId}
                processLevelTypeId={processLevelTypeId}
                projectLocationId={projectLocationId}
                resultChainIndicators={resultChainIndicators}
              />
            )}
            {modalType === "aggregateOnly" && (
              <ResultChainAggregateOnlyModal
                resultChainAggregates={
                  resultChainIndicator["resultChainAggregates"]
                }
                year={year}
                monthId={monthId}
                processLevelItemId={processLevelItemId}
                processLevelTypeId={processLevelTypeId}
                projectLocationId={projectLocationId}
                resultChainIndicators={resultChainIndicators}
              />
            )}
            {modalType === "attributesOnly" && (
              <ResultChainAttributeOnlyModal
                resultChainAttributes={
                  resultChainIndicator["resultChainAttributes"]
                }
                year={year}
                monthId={monthId}
                processLevelItemId={processLevelItemId}
                processLevelTypeId={processLevelTypeId}
                projectLocationId={projectLocationId}
                resultChainIndicators={resultChainIndicators}
              />
            )}
            {modalType === "indicatorField" && (
              <ResultChainIndicatorModal
                resultChainIndicator={resultChainIndicator}
                year={year}
                monthId={monthId}
                processLevelItemId={processLevelItemId}
                processLevelTypeId={processLevelTypeId}
                projectLocationId={projectLocationId}
                resultChainIndicators={resultChainIndicators}
              />
            )}
          </DialogContent>
        </Dialog>
      </Grid>
    </Grid>
  );
};
export default QuantitativeResultField;
