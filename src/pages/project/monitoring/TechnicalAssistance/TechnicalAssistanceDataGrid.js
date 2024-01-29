import React, { useState } from "react";
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
}) => {
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
                      <NavLink
                        to={`/project/monitoring/technical-assistance-monitoring-detail/${params.id}`}
                      >
                        <Button startIcon={<Link2 />} size="small"></Button>
                      </NavLink>
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

const TechnicalAssistanceDataGrid = ({
  processLevelItemId,
  processLevelTypeId,
}) => {
  return (
    <React.Fragment>
      <Helmet title="Technical Assistance" />
      <Typography variant="h3" gutterBottom display="inline">
        Technical Assistance
      </Typography>
      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link
          component={NavLink}
          to={`/project/design-project/${processLevelItemId}/${processLevelTypeId}`}
        >
          Project Monitoring
        </Link>
        <Typography>Technical Assistance</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <TechnicalAssistanceData
        processLevelItemId={processLevelItemId}
        processLevelTypeId={processLevelTypeId}
      />
    </React.Fragment>
  );
};
export default TechnicalAssistanceDataGrid;
