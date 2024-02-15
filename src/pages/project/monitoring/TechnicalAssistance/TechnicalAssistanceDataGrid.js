import React, { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import {
  Button,
  Link,
  Breadcrumbs,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Paper as MuiPaper,
  Typography,
} from "@mui/material";

import { NavLink, useNavigate } from "react-router-dom";
import { Add as AddIcon } from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Link2 } from "react-feather";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { getTechnicalAssistanceByProcessLevelItemId } from "../../../../api/technical-assistance";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const CardContent = styled(MuiCardContent)(spacing);

const TechnicalAssistanceData = ({
  processLevelItemId,
  processLevelTypeId,
  onActionChange,
}) => {
  console.log("***TechnicalAssistanceData***" + processLevelItemId);
  const [pageSize, setPageSize] = useState(5);
  const {
    data: InnovationsData,
    isLoading: isLoadingInnovations,
    isError: isErrorInnovations,
    error,
  } = useQuery(
    ["getTechnicalAssistanceByProcessLevelItemId", processLevelItemId],
    getTechnicalAssistanceByProcessLevelItemId,
    {
      enabled: !!processLevelItemId,
    }
  );

  if (isErrorInnovations) {
    toast(error.response.data, {
      type: "error",
    });
  }

  const handleActionChange = useCallback(
    (id, status) => {
      onActionChange({ id: id, status: status });
    },
    [onActionChange]
  );

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
                  field: "startDate",
                  headerName: "Start Date",
                  editable: false,
                  flex: 1,
                },
                {
                  field: "endDate",
                  headerName: "End Date",
                  editable: false,
                  flex: 1,
                },
                {
                  field: "action",
                  headerName: "Action",
                  sortable: false,
                  flex: 1,
                  renderCell: (params) => (
                    <>
                      <Button
                        startIcon={<Link2 />}
                        size="small"
                        onClick={(e) => {
                          handleActionChange(params.id, false);
                        }}
                      ></Button>
                    </>
                  ),
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

const TechnicalAssistanceDataGrid = (props) => {
  return (
    <React.Fragment>
      <Helmet title="Technical Assistance" />
      <Typography variant="h5" gutterBottom display="inline">
        Technical Assistance Monitoring
      </Typography>
      <Divider my={3} />
      <TechnicalAssistanceData
        processLevelItemId={props.processLevelItemId}
        processLevelTypeId={props.processLevelTypeId}
        onActionChange={props.onActionChange}
      />
    </React.Fragment>
  );
};
export default TechnicalAssistanceDataGrid;
