import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { useParams } from "react-router-dom";
import EditInnovation from "./EditInnovation";
import ThematicFocus from "./ThematicFocus";
import GeoFocus from "./GeoFocus";
import InnovationObjectives from "./InnovationObjectives";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      style={{ width: "100%" }}
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={"span"} variant={"body2"}>
            {children}
          </Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const InnovationDetail = (props) => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        <Tab label="Basic Information" {...a11yProps(0)} />
        <Tab label="Thematic Focus" {...a11yProps(1)} />
        <Tab label="Geographic Focus" {...a11yProps(2)} />
        <Tab label="Objective & Classification" {...a11yProps(3)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <EditInnovation id={props.id} onActionChange={props.onActionChange} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ThematicFocus id={props.id} onActionChange={props.onActionChange} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <GeoFocus id={props.id} onActionChange={props.onActionChange} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <InnovationObjectives
          id={props.id}
          onActionChange={props.onActionChange}
        />
      </TabPanel>
    </Box>
  );
};

export default InnovationDetail;
