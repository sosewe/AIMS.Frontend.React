import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Paper as MuiPaper,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { getInnovationByProcessLevelItemId } from "../../../api/innovation";
import { toast } from "react-toastify";
import InnovationMonitoringActions from "./InnovationMonitoringActions";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const CardContent = styled(MuiCardContent)(spacing);

const InnovationData = ({ processLevelItemId, processLevelTypeId }) => {
  const [pageSize, setPageSize] = useState(5);
  const {
    data: InnovationsData,
    isLoading: isLoadingInnovations,
    isError: isErrorInnovations,
    error,
  } = useQuery(
    ["getInnovationByProcessLevelItemId", processLevelItemId],
    getInnovationByProcessLevelItemId,
    {
      enabled: !!processLevelItemId,
    }
  );

  if (isErrorInnovations) {
    toast(error.response.data, {
      type: "error",
    });
  }

  const actionLink = (params) => {
    return <InnovationMonitoringActions params={params} />;
  };
  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Paper>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rowsPerPageOptions={[5, 10, 25]}
              rows={
                isLoadingInnovations || isErrorInnovations
                  ? []
                  : InnovationsData
                  ? InnovationsData.data
                  : []
              }
              columns={[
                {
                  field: "title",
                  headerName: "Title",
                  editable: false,
                  flex: 1,
                },
                {
                  field: "proposedSolution",
                  headerName: "Proposed Solution",
                  editable: false,
                  flex: 1,
                },
                {
                  field: "targetBeneficiary",
                  headerName: "Target Beneficiary",
                  editable: false,
                  flex: 1,
                },
                {
                  field: "difference",
                  headerName: "Difference",
                  editable: false,
                  flex: 1,
                },
                {
                  field: "action",
                  headerName: "Action",
                  sortable: false,
                  flex: 1,
                  renderCell: (params) => {
                    return actionLink(params);
                  },
                },
              ]}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              loading={isLoadingInnovations}
              getRowHeight={() => "auto"}
            />
          </div>
        </Paper>
      </CardContent>
    </Card>
  );
};

const InnovationDataGrid = ({ processLevelItemId, processLevelTypeId }) => {
  return (
    <React.Fragment>
      <Helmet title="Innovation Monitoring" />
      <Typography variant="h3" gutterBottom display="inline">
        Innovation Monitoring
      </Typography>
      <Divider my={6} />
      <InnovationData
        processLevelItemId={processLevelItemId}
        processLevelTypeId={processLevelTypeId}
      />
    </React.Fragment>
  );
};
export default InnovationDataGrid;
