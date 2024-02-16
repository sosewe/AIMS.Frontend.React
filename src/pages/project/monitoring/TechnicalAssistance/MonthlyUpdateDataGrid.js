import React, { useState, useCallback } from "react";
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
import { Edit, Link2, ChevronLeft } from "react-feather";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { getTechnicalAssistanceMonthlyUpdateByTechnicalAssistanceId } from "../../../../api/technical-assistance-monthly-update";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const CardContent = styled(MuiCardContent)(spacing);

const MonthlyUpdateDataGridData = (props) => {
  const id = props.id;
  const onActionChange = props.onActionChange;
  const onTechnicalAssistanceActionChange =
    props.onTechnicalAssistanceActionChange;

  const [technicalAssistanceId, setTechnicalAssistanceId] = useState(false);
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

  const handleActionChange = useCallback(
    (event) => {
      onActionChange({ id: 0, status: true });
    },
    [onActionChange]
  );

  const handleTechnicalAssistanceActionChange = useCallback(
    (id, status) => {
      onTechnicalAssistanceActionChange({
        id: id,
        status: status,
      });
    },
    [onTechnicalAssistanceActionChange]
  );

  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Paper>
          <Button
            mr={2}
            mb={5}
            variant="contained"
            color="error"
            onClick={() => handleTechnicalAssistanceActionChange(0, false)}
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
                      <Button
                        startIcon={<Edit />}
                        size="small"
                        onClick={(e) => {
                          handleTechnicalAssistanceActionChange(
                            params.id,
                            false
                          );
                          setTechnicalAssistanceId(params.id);
                        }}
                      ></Button>
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

          <br />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            mt={3}
            onClick={() => handleActionChange({ id: 0, action: 1 })}
          >
            <ChevronLeft /> Back
          </Button>
        </Paper>
      </CardContent>
    </Card>
  );
};

const MonthlyUpdateDataGrid = (props) => {
  return (
    <React.Fragment>
      <Helmet title="Technical Assistance" />
      <Typography variant="h5" gutterBottom display="inline">
        Monthly Update
      </Typography>
      <Divider my={6} />
      <MonthlyUpdateDataGridData
        id={props.id}
        processLevelItemId={props.processLevelItemId}
        processLevelTypeId={props.processLevelTypeId}
        onActionChange={props.onActionChange}
        onTechnicalAssistanceActionChange={
          props.onTechnicalAssistanceActionChange
        }
      />
    </React.Fragment>
  );
};
export default MonthlyUpdateDataGrid;
