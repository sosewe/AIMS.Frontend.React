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
import { useQuery } from "@tanstack/react-query";
import { getAdvocacyByProcessLevelItemId } from "../../../api/advocacy";
import { DataGrid } from "@mui/x-data-grid";
import AdvocacyMonitoringActions from "./AdvocacyMonitoringActions";
import { toast } from "react-toastify";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const CardContent = styled(MuiCardContent)(spacing);

const AdvocacyData = ({ processLevelItemId, processLevelTypeId }) => {
  const [pageSize, setPageSize] = useState(5);
  const {
    data: AdvocacyData,
    isLoading: isLoadingAdvocacy,
    isError: isErrorAdvocacy,
    error,
  } = useQuery(
    ["getAdvocacyByProcessLevelItemId", processLevelItemId],
    getAdvocacyByProcessLevelItemId,
    { enabled: !!processLevelItemId }
  );

  if (isErrorAdvocacy) {
    toast(error.response.data, {
      type: "error",
    });
  }

  const actionLink = (params) => {
    return <AdvocacyMonitoringActions params={params} />;
  };

  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Paper>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rowsPerPageOptions={[5, 10, 25]}
              rows={
                isLoadingAdvocacy || isErrorAdvocacy
                  ? []
                  : AdvocacyData
                  ? AdvocacyData.data
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
                  field: "beneficiary",
                  headerName: "Beneficiary",
                  editable: false,
                  flex: 1,
                },
                {
                  field: "advocacyNeed",
                  headerName: "Advocacy Need",
                  editable: false,
                  flex: 1,
                },
                {
                  field: "expectedResult",
                  headerName: "Expected Result",
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
              loading={isLoadingAdvocacy}
              getRowHeight={() => "auto"}
            />
          </div>
        </Paper>
      </CardContent>
    </Card>
  );
};

const AdvocacyDataGrid = ({ processLevelItemId, processLevelTypeId }) => {
  return (
    <React.Fragment>
      <Helmet title="Advocacy Monitoring" />
      <Typography variant="h3" gutterBottom display="inline">
        Advocacy Monitoring
      </Typography>
      <Divider my={6} />
      <AdvocacyData
        processLevelItemId={processLevelItemId}
        processLevelTypeId={processLevelTypeId}
      />
    </React.Fragment>
  );
};
export default AdvocacyDataGrid;
