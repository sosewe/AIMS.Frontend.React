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
import { getTechnicalAssistanceMonthlyUpdateByTechnicalAssistanceId } from "../../../../api/technical-assistance-monthly-update";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const CardContent = styled(MuiCardContent)(spacing);

const MonthlyUpdateDataGridData = ({ id }) => {
  const [pageSize, setPageSize] = useState(5);
  const navigate = useNavigate();
  const {
    data: MonthlyUpdateData,
    isLoading: isLoadingMonthlyUpdate,
    isError: isErrorMonthlyUpdate,
    error,
  } = useQuery(
    ["getTechnicalAssistanceMonthlyUpdateByTechnicalAssistanceId", id],
    getTechnicalAssistanceMonthlyUpdateByTechnicalAssistanceId,
    {
      enabled: !!id,
    }
  );

  if (isErrorMonthlyUpdate) {
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
                `/project/monitoring/technical-assistance-monitoring-monthly-update/${id}`
              )
            }
          >
            <AddIcon /> New Monthly Update
          </Button>
        </Paper>
        <br></br>
        <Paper>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rowsPerPageOptions={[5, 10, 25]}
              rows={
                isLoadingMonthlyUpdate || isErrorMonthlyUpdate
                  ? []
                  : MonthlyUpdateData
                  ? MonthlyUpdateData.data
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
                  field: "month",
                  headerName: "Month",
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
                        to={`/project/monitoring/technical-assistance-monitoring-monthly-update/${id}/${params.id}`}
                      >
                        <Button startIcon={<Link2 />} size="small"></Button>
                      </NavLink>
                    </>
                  ),
                },
              ]}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              loading={isLoadingMonthlyUpdate}
              getRowHeight={() => "auto"}
            />
          </div>
        </Paper>
      </CardContent>
    </Card>
  );
};

const MonthlyUpdateDataGrid = ({ id }) => {
  return (
    <React.Fragment>
      <Helmet title="Technical Assistance" />
      <Typography variant="h3" gutterBottom display="inline">
        Monthly Update
      </Typography>
      <Divider my={6} />
      <MonthlyUpdateDataGridData id={id} />
    </React.Fragment>
  );
};
export default MonthlyUpdateDataGrid;
