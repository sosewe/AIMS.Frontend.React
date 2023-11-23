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
import {
  newTechnicalAssistanceQuarterlyUpdate,
  getTechnicalAssistanceQuarterlyUpdateByTechnicalAssistanceId,
} from "../../../../api/technical-assistance-quarterly-update";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const CardContent = styled(MuiCardContent)(spacing);

const QuarterlyUpdateDataGridData = ({ id }) => {
  const [pageSize, setPageSize] = useState(5);
  const navigate = useNavigate();
  const {
    data: QuarterlyUpdateData,
    isLoading: isLoadingQuarterlyUpdate,
    isError: isErrorQuarterlyUpdate,
    error,
  } = useQuery(
    ["getTechnicalAssistanceQuarterlyUpdateByTechnicalAssistanceId", id],
    getTechnicalAssistanceQuarterlyUpdateByTechnicalAssistanceId,
    {
      enabled: !!id,
    }
  );

  if (isErrorQuarterlyUpdate) {
    toast(error.response.data, {
      type: "error",
    });
  }

  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Paper>
          <Button
            variant="contained"
            color="error"
            onClick={() =>
              navigate(
                `/project/monitoring/technical-assistance-monitoring-quarterly-update/${id}`
              )
            }
          >
            <AddIcon /> New Quarterly Update
          </Button>
        </Paper>
        <br></br>
        <Paper>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rowsPerPageOptions={[5, 10, 25]}
              rows={
                isLoadingQuarterlyUpdate || isErrorQuarterlyUpdate
                  ? []
                  : QuarterlyUpdateData
                  ? QuarterlyUpdateData.data
                  : []
              }
              columns={[
                {
                  field: "title",
                  headerName: "Technical Assistance",
                  editable: false,
                  flex: 1,
                  valueGetter: (params) =>
                    params.row.technicalAssistances.title,
                },
                {
                  field: "quarter",
                  headerName: "Quarter",
                  editable: false,
                  flex: 1,
                },
                {
                  field: "year",
                  headerName: "Year",
                  editable: false,
                  flex: 1,
                },
                {
                  field: "action",
                  headerName: "Action",
                  sortable: false,
                  flex: 1,
                  valueGetter: (params) =>
                    params.row.technicalAssistances.title,
                  renderCell: (params) => (
                    <>
                      <NavLink
                        to={`/project/monitoring/technical-assistance-monitoring-quarterly-update/${id}/${params.id}`}
                      >
                        <Button startIcon={<Link2 />} size="small"></Button>
                      </NavLink>
                    </>
                  ),
                },
              ]}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              loading={isLoadingQuarterlyUpdate}
              getRowHeight={() => "auto"}
            />
          </div>
        </Paper>
      </CardContent>
    </Card>
  );
};

const QuarterlyUpdateDataGrid = ({ id }) => {
  return (
    <React.Fragment>
      <Helmet title="Technical Assistance" />
      <Typography variant="h3" gutterBottom display="inline">
        Quarterly Update
      </Typography>
      <Divider my={6} />
      <QuarterlyUpdateDataGridData id={id} />
    </React.Fragment>
  );
};
export default QuarterlyUpdateDataGrid;
