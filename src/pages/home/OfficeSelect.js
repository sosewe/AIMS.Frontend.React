import React, { useContext } from "react";
import {
  Avatar,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { Settings } from "react-feather";
import useKeyCloakAuth from "../../hooks/useKeyCloakAuth";
import { OfficeContext } from "../../App";

const OfficeSelect = () => {
  const user = useKeyCloakAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const officeContext = useContext(OfficeContext);
  const selectedOffice = officeContext.selectedOffice;

  const data = user?.tokenParsed?.Office ?? [];
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleOfficeChange = (office) => {
    officeContext.setSelectedOffice(office);
    handleClose();
  };

  React.useEffect(() => {
    if (!selectedOffice && data.length > 0) {
      officeContext.setSelectedOffice(data[0]);
    }
  }, [data, officeContext]);

  return (
    <React.Fragment>
      <Tooltip title="Office settings">
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar sx={{ width: 30, height: 30 }}>
            {selectedOffice ? selectedOffice.charAt(0) : ""}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: "center", vertical: "top" }}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        {data.map((office, key) => (
          <MenuItem
            key={key}
            onClick={() => handleOfficeChange(office)}
            style={{
              fontWeight: office === selectedOffice ? "bold" : "normal",
              fontSize: "16px",
            }}
          >
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            {office}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
};
export default OfficeSelect;