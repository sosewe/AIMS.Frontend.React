import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import styled from "@emotion/styled";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider as MuiDivider,
  Grid,
  Link,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAttributeTypeById } from "../../api/attribute-type";
import { Edit2, Trash as TrashIcon } from "react-feather";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  deleteAttributeResponseOptionById,
  getAttributeResponseOptions,
} from "../../api/attribute-response-option";
import { Add as AddIcon } from "@mui/icons-material";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const ViewAttributeContainer = () => {
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = React.useState(false);
  const [attributeResponseOptionId, setAttributeResponseOptionId] =
    React.useState();
  let { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isLoading: isLoadingAttributeType, data: attributeTypeData } =
    useQuery(["getAttributeTypeById", id], getAttributeTypeById, {
      enabled: !!id,
    });
  const { isLoading, isError, data } = useQuery(
    ["getAttributeResponseOptions", id],
    getAttributeResponseOptions,
    { enabled: !!id }
  );

  const { refetch } = useQuery(
    ["deleteAttributeResponseOptionById", attributeResponseOptionId],
    deleteAttributeResponseOptionById,
    { enabled: false }
  );

  function handleClickOpen(id) {
    setOpen(true);
    setAttributeResponseOptionId(id);
  }

  function handleClose() {
    setOpen(false);
  }

  const handleDeleteAttributeResponseOption = async () => {
    await refetch();
    setOpen(false);
    await queryClient.invalidateQueries(["getAttributeResponseOptions"]);
  };

  return (
    <Grid container spacing={2}>
      <Grid item md={12}>
        <Card mb={6}>
          <CardHeader title="Attribute" />
          <CardContent pb={1}>
            <Grid container spacing={2}>
              <Grid item md={4}>
                <strong>
                  Name:{" "}
                  {!isLoadingAttributeType ? attributeTypeData.data.name : ""}
                </strong>
              </Grid>
              <Grid item md={4}>
                <strong>
                  Initials:{" "}
                  {!isLoadingAttributeType
                    ? attributeTypeData.data.attributeDataType.dataType
                    : ""}
                </strong>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={12}>
        <Card mb={6}>
          <CardHeader title="Attribute Response Option" />
          <CardContent pb={1}>
            <Button
              mr={2}
              variant="contained"
              color="error"
              onClick={() =>
                navigate(`/indicator/new-attribute-response-option/${id}`)
              }
            >
              <AddIcon /> New Attribute Response Option
            </Button>
            <div style={{ height: 400, width: "100%", marginTop: 16 }}>
              <DataGrid
                rowsPerPageOptions={[5, 10, 25]}
                rows={isLoading || isError ? [] : data ? data.data : []}
                columns={[
                  {
                    field: "responseOption",
                    headerName: "Response Option",
                    editable: false,
                    flex: 1,
                  },
                  {
                    field: "mandatory",
                    headerName: "Mandatory",
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
                          to={`/indicator/new-attribute-response-option/${id}/${params.id}`}
                        >
                          <Button startIcon={<Edit2 />} size="small"></Button>
                        </NavLink>
                        <Button
                          startIcon={<TrashIcon />}
                          size="small"
                          onClick={() => handleClickOpen(params.id)}
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
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                Delete Attribute Response Option
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete Attribute Response Option?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleDeleteAttributeResponseOption}
                  color="primary"
                >
                  Yes
                </Button>
                <Button onClick={handleClose} color="error" autoFocus>
                  No
                </Button>
              </DialogActions>
            </Dialog>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
const ViewAttribute = () => {
  return (
    <React.Fragment>
      <Helmet title="View Attribute" />
      <Typography variant="h3" gutterBottom display="inline">
        View Attribute
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/indicator/attributes-list">
          Attributes
        </Link>
        <Typography>View Attribute</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <ViewAttributeContainer />
    </React.Fragment>
  );
};
export default ViewAttribute;
