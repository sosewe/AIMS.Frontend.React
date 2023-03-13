import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
} from "@mui/material";
import styled from "@emotion/styled";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteAdministrativeProgrammeById } from "../../../../api/administrative-programme";
import { deleteInnovationById } from "../../../../api/innovation";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 90,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 14,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: "red",
      },
    },
  },
}));

const InnovationDataActions = ({ params }) => {
  const navigate = useNavigate();
  const [openDeleteDialog, setDeleteDialog] = useState(false);
  const [id, setId] = useState();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const { refetch } = useQuery(
    ["deleteInnovationById", id],
    deleteInnovationById,
    { enabled: false }
  );
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEditInnovation = () => {
    navigate(
      `/project/new-innovation/${params.row.processLevelItemId}/${params.row.processLevelTypeId}/${params.id}`
    );
  };
  const handleDeleteInnovation = () => {
    setDeleteDialog(true);
    setId(params.id);
  };
  const onDeleteInnovation = async () => {
    await refetch();
    setDeleteDialog(false);
    await queryClient.invalidateQueries(["getInnovations"]);
  };
  return (
    <React.Fragment>
      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          height: "30px",
          backgroundColor: "#05C3DE",
          ":hover": {
            bgcolor: "#BA0C2F",
            color: "white",
          },
        }}
      >
        Actions
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => handleEditInnovation()}
          sx={{ color: "#014d88", fontWeight: "bolder" }}
          disableRipple
        >
          <EditIcon style={{ color: "#014d88" }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => handleDeleteInnovation()}
          sx={{ color: "#992E62", fontWeight: "bolder" }}
          disableRipple
        >
          <DeleteIcon style={{ color: "#992E62" }} />
          Delete
        </MenuItem>
      </StyledMenu>
      <Dialog
        open={openDeleteDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Innovation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete Innovation?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDeleteInnovation} color="primary">
            Yes
          </Button>
          <Button onClick={handleClose} color="error" autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
export default InnovationDataActions;
