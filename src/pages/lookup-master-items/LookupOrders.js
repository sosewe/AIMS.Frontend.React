import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider as MuiDivider,
  Link,
  Paper as MuiPaper,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { getLookupMasters } from "../../api/lookup-master";
import ManageLookupOrder from "./ManageLookupOrder";
import { Eye } from "react-feather";
import { getLookupOptionsById } from "../../api/lookup-option";
import { getMaxOptionOrderById } from "../../api/lookup-master";
import { toast } from "react-toastify";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

const LookupMasterItemsData = () => {
  const [open, setOpen] = useState(false);
  const [openLookupItem, setOpenLookupItem] = useState(false);
  const [lookupMasterId, setLookupMasterId] = useState();
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading, isError } = useQuery(
    ["getLookupMasters"],
    getLookupMasters
  );
  const {
    data: lookupOptions,
    isLoading: isLoadingLookupOption,
    isError: isErrorLookupOptions,
  } = useQuery(["getLookupOptionsById", lookupMasterId], getLookupOptionsById, {
    enabled: !!lookupMasterId,
  });
  const {} = useQuery(
    ["getMaxOptionOrderById", lookupMasterId],
    getMaxOptionOrderById,
    {
      enabled: !!lookupMasterId,
    }
  );
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpenLookupItems = (id) => {
    setOpenLookupItem(true);
    setLookupMasterId(id);
  };
  const handleCloseLookupItems = () => {
    setOpenLookupItem(false);
  };
  const handleClick = () => {
    setOpen(false);
    toast("Successfully Configured Lookups", {
      type: "success",
    });
  };
  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Button
          mr={2}
          variant="contained"
          color="error"
          onClick={() => setOpen(true)}
        >
          Manage Lookups
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
              /* {
                field: "alias",
                headerName: "Alias",
                editable: false,
                flex: 1,
              },*/
              {
                field: "getMaxOptionOrderById",
                headerName: "Order",
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
                      startIcon={<Eye />}
                      size="small"
                      onClick={() => handleClickOpenLookupItems(params.id)}
                    ></Button>
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
        <Dialog
          fullWidth={true}
          maxWidth="md"
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Manage Lookups</DialogTitle>
          <Divider />
          <DialogContent>
            <ManageLookupOrder handleClick={handleClick} />
          </DialogContent>
        </Dialog>
        <Dialog
          fullWidth={true}
          maxWidth="md"
          open={openLookupItem}
          onClose={handleCloseLookupItems}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Lookup Items</DialogTitle>
          <Divider />
          <DialogContent>
            {!isLoadingLookupOption && !isErrorLookupOptions
              ? lookupOptions.data.map((lookupOption) => (
                  <Typography
                    variant="h3"
                    gutterBottom
                    display="inline"
                    key={lookupOption.id}
                  >
                    {lookupOption.lookupItemName},&nbsp;
                  </Typography>
                ))
              : ""}
          </DialogContent>
        </Dialog>
      </Paper>
    </Card>
  );
};
const LookupOrders = () => {
  return (
    <React.Fragment>
      <Helmet title="Lookup Master Items" />
      <Typography variant="h3" gutterBottom display="inline">
        Lookup Master Items
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/lookup/lookupMasterItems">
          Lookup Master Items
        </Link>
        <Typography>ORDERED Lookup Master Item List</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <LookupMasterItemsData />
    </React.Fragment>
  );
};
export default LookupOrders;
