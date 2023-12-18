import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import styled from "@emotion/styled";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider as MuiDivider,
  Link,
  Paper as MuiPaper,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { NavLink, useNavigate } from "react-router-dom";
import { Add as AddIcon } from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Edit2, Eye, Trash as TrashIcon } from "react-feather";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getAttributeTypes } from "../../api/attribute-type";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

const AttributesListData = () => {
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(10);
  const { isLoading, isError, data } = useQuery(
    ["getAttributeTypes"],
    getAttributeTypes
  );

  function GetAttributeDataType(params) {
    console.log(params);
    const personnelId = params.value;
  }

  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Button
          mr={2}
          variant="contained"
          color="error"
          onClick={() => navigate("/indicator/new-attribute")}
        >
          <AddIcon /> New Attribute Type
        </Button>
      </CardContent>
      <br />
      <Paper>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rowsPerPageOptions={[5, 10, 25]}
            rows={isLoading || isError ? [] : data ? data.data : []}
            columns={[
              {
                field: "name",
                headerName: "Name",
                editable: false,
                flex: 1,
              },
              {
                field: "attributeDataType",
                headerName: "Attribute Data Type",
                editable: false,
                flex: 1,
                valueGetter: ({ row }) => row.attributeDataType.dataType,
              },
              {
                field: "action",
                headerName: "Action",
                sortable: false,
                flex: 1,
                renderCell: (params) => (
                  <>
                    <NavLink to={`/indicator/new-attribute/${params.id}`}>
                      <Button startIcon={<Edit2 />} size="small"></Button>
                    </NavLink>
                    <NavLink to={`/indicator/view-attribute/${params.id}`}>
                      <Button startIcon={<Eye />} size="small"></Button>
                    </NavLink>
                    {/*<Button*/}
                    {/*  startIcon={<TrashIcon />}*/}
                    {/*  size="small"*/}
                    {/*  onClick={() => handleClickOpen(params.id)}*/}
                    {/*></Button>*/}
                  </>
                ),
              },
            ]}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            loading={isLoading}
            components={{ Toolbar: GridToolbar }}
            getRowHeight={() => "auto"}
          />
        </div>
        {/*<Dialog*/}
        {/*  open={open}*/}
        {/*  onClose={handleClose}*/}
        {/*  aria-labelledby="alert-dialog-title"*/}
        {/*  aria-describedby="alert-dialog-description"*/}
        {/*>*/}
        {/*  <DialogTitle id="alert-dialog-title">*/}
        {/*    Delete Administrative Programme*/}
        {/*  </DialogTitle>*/}
        {/*  <DialogContent>*/}
        {/*    <DialogContentText id="alert-dialog-description">*/}
        {/*      Are you sure you want to delete Administrative Programme?*/}
        {/*    </DialogContentText>*/}
        {/*  </DialogContent>*/}
        {/*  <DialogActions>*/}
        {/*    <Button*/}
        {/*      onClick={handleDeleteAdministrativeProgramme}*/}
        {/*      color="primary"*/}
        {/*    >*/}
        {/*      Yes*/}
        {/*    </Button>*/}
        {/*    <Button onClick={handleClose} color="error" autoFocus>*/}
        {/*      No*/}
        {/*    </Button>*/}
        {/*  </DialogActions>*/}
        {/*</Dialog>*/}
      </Paper>
    </Card>
  );
};

const AttributesList = () => {
  return (
    <React.Fragment>
      <Helmet title="Attributes Types" />
      <Typography variant="h3" gutterBottom display="inline">
        Attributes Types
      </Typography>
      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/indicator/attributes-list">
          Attributes Types
        </Link>
        <Typography>Attributes Types List</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <AttributesListData />
    </React.Fragment>
  );
};
export default AttributesList;
