import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import addTechnicalAssistance from "./addTechnicalAssistance";
import { useParams } from "react-router-dom";
import GeoFocus from "./GeoFocus";
import ProjectObjectives from "./ProjectObjectives";
import ThematicFocus from "./ThematicFocus";
//import EnterTargetQuantitativeResultsFramework from "./EnterTargetQuantitativeResultsFramework";
// import InnovationData from "./Innovation/InnovationData";
// import AdvocacyData from "./Advocacy/AdvocacyData";

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

const Advocacy = () => {
  const [value, setValue] = React.useState(0);
  let { id, processLevelTypeId } = useParams();
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
        <Tab label="Objective & classification" {...a11yProps(3)} />
        {/* <Tab label="Results Framework" {...a11yProps(4)} /> */}
        {/* <Tab label="Innovation" {...a11yProps(5)} />
        <Tab label="Advocacy" {...a11yProps(6)} /> */}
      </Tabs>
      <TabPanel value={value} index={0}>
        <addTechnicalAssistance id={id} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ThematicFocus id={id} processLevelTypeId={processLevelTypeId} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <GeoFocus id={id} processLevelTypeId={processLevelTypeId} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ProjectObjectives id={id} processLevelTypeId={processLevelTypeId} />
      </TabPanel>
      {/* <TabPanel value={value} index={4}>
        <EnterTargetQuantitativeResultsFramework
          processLevelItemId={id}
          processLevelTypeId={processLevelTypeId}
        />
      </TabPanel> */}
      <TabPanel index={5} value={value}>
        {/* <InnovationData
          processLevelItemId={id}
          processLevelTypeId={processLevelTypeId}
        /> */}
      </TabPanel>
      <TabPanel index={6} value={value}>
        {/* <AdvocacyData
          processLevelItemId={id}
          processLevelTypeId={processLevelTypeId}
        /> */}
      </TabPanel>
    </Box>
  );
};

export default Advocacy;
