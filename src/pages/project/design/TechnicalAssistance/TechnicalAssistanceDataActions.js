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
import { deleteAdvocacyById } from "../../../../api/advocacy";

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

const AdvocacyDataActions = ({ params }) => {
  const navigate = useNavigate();
  const [openDeleteDialog, setDeleteDialog] = useState(false);
  const [id, setId] = useState();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const { refetch } = useQuery(["deleteAdvocacyById", id], deleteAdvocacyById, {
    enabled: false,
  });
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEditAdvocacy = () => {
    navigate(
      `/project/design/new-advocacy/${params.row.processLevelItemId}/${params.row.processLevelTypeId}/${params.id}`
    );
  };
  const handleDeleteAdvocacy = () => {
    setDeleteDialog(true);
    setId(params.id);
  };
  const onDeleteAdvocacy = async () => {
    await refetch();
    setDeleteDialog(false);
    await queryClient.invalidateQueries(["getAdvocates"]);
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
          onClick={() => handleEditAdvocacy()}
          sx={{ color: "#014d88", fontWeight: "bolder" }}
          disableRipple
        >
          <EditIcon style={{ color: "#014d88" }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => handleDeleteAdvocacy()}
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
        <DialogTitle id="alert-dialog-title">Delete Advocacy</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete Advocacy?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDeleteAdvocacy} color="primary">
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
export default AdvocacyDataActions;
