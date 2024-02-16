import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import NewProjectForm from "./NewProjectForm";
import { useParams } from "react-router-dom";
import GeoFocus from "./GeoFocus";
import ProjectObjectives from "./ProjectObjectives";
import ThematicFocus from "./ThematicFocus";
import EnterTargetQuantitativeResultsFramework from "./EnterTargetQuantitativeResultsFramework";
import Innovation from "./Innovation/NewInnovation";
import NewInnovation from "./Innovation/NewInnovation";
import EditInnovation from "./Innovation/EditInnovation";
import InnovationData from "./Innovation/InnovationData";
import InnovationDetail from "./Innovation/InnovationDetail";
import NewTechnicalAssistance from "./TechnicalAssistance/NewTechnicalAssistance";
import EditTechnicalAssistance from "./TechnicalAssistance/EditTechnicalAssistance";
import TechnicalAssistanceDetail from "./TechnicalAssistance/TechnicalAssistanceDetail";
import TechnicalAssistanceData from "./TechnicalAssistance/TechnicalAssistanceData";
import NewAdvocacyObjective from "./Advocacy/NewAdvocacyObjective";
import NewAdocacy from "./Advocacy/NewAdvocacy";
import AdvocacyObjectives from "./Advocacy/AdvocacyObjectives";
import AdvocacyDetail from "./Advocacy/AdvocacyDetail";
import AdvocacyData from "./Advocacy/AdvocacyData";
import NewLearning from "./Learning/NewLearning";
import EditLearning from "./Learning/EditLearning";
import LearningData from "./Learning/LearningData";
import LearningDetail from "./Learning/LearningDetail";
import Learning from "./Learning/NewLearning";

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

const DesignProject = () => {
  const [action, setAction] = React.useState({ id: 0, status: true, data: {} });
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
        <Tab label="Objectives" {...a11yProps(3)} />
        <Tab label="Results Framework" {...a11yProps(4)} />
        <Tab label="Innovation" {...a11yProps(5)} />
        <Tab label="Advocacy" {...a11yProps(6)} />
        <Tab label="Technical Assistance" {...a11yProps(7)} />
        <Tab label="Research (Learning)" {...a11yProps(8)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <NewProjectForm id={id} />
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
      <TabPanel value={value} index={4}>
        <EnterTargetQuantitativeResultsFramework
          processLevelItemId={id}
          processLevelTypeId={processLevelTypeId}
        />
      </TabPanel>
      <TabPanel index={5} value={value}>
        {(() => {
          if (action.status) {
            return (
              <InnovationData
                processLevelItemId={id}
                processLevelTypeId={processLevelTypeId}
                onActionChange={setAction}
              />
            );
          } else if (!action.status && action.id === 0) {
            return (
              <>
                <NewInnovation
                  processLevelItemId={id}
                  processLevelTypeId={processLevelTypeId}
                  onActionChange={setAction}
                />
              </>
            );
          } else {
            return (
              <>
                <InnovationDetail
                  id={action.id}
                  processLevelItemId={id}
                  processLevelTypeId={processLevelTypeId}
                  onActionChange={setAction}
                />
              </>
            );
          }
        })()}
      </TabPanel>
      <TabPanel index={6} value={value}>
        {(() => {
          if (action.status) {
            return (
              <AdvocacyData
                processLevelItemId={id}
                processLevelTypeId={processLevelTypeId}
                onActionChange={setAction}
              />
            );
          } else if (!action.status && action.id === 0) {
            return (
              <>
                <NewAdocacy
                  processLevelItemId={id}
                  processLevelTypeId={processLevelTypeId}
                  onActionChange={setAction}
                />
              </>
            );
          } /*else if (!action.status && action.id === 3) {
            return (
              <>
                <NewAdvocacyObjective
                  id={action.id}
                  processLevelItemId={id}
                  processLevelTypeId={processLevelTypeId}
                  onActionChange={setAction}
                />
              </>
            );
          }*/ else if (!action.status && action.id === 4) {
            return (
              <>
                <AdvocacyObjectives
                  id={action.id}
                  processLevelItemId={id}
                  processLevelTypeId={processLevelTypeId}
                  onActionChange={setAction}
                />
              </>
            );
          } else {
            return (
              <>
                <AdvocacyDetail
                  id={action.id}
                  processLevelItemId={id}
                  processLevelTypeId={processLevelTypeId}
                  onActionChange={setAction}
                />
              </>
            );
          }
        })()}
      </TabPanel>
      <TabPanel index={7} value={value}>
        {(() => {
          if (action.status) {
            return (
              <TechnicalAssistanceData
                processLevelItemId={id}
                processLevelTypeId={processLevelTypeId}
                onActionChange={setAction}
              />
            );
          } else if (!action.status && action.id === 0) {
            return (
              <>
                <NewTechnicalAssistance
                  processLevelItemId={id}
                  processLevelTypeId={processLevelTypeId}
                  onActionChange={setAction}
                />
              </>
            );
          } else {
            return (
              <>
                <TechnicalAssistanceDetail
                  id={action.id}
                  processLevelItemId={id}
                  processLevelTypeId={processLevelTypeId}
                  onActionChange={setAction}
                />
              </>
            );
          }
        })()}
      </TabPanel>
      <TabPanel index={8} value={value}>
        {(() => {
          if (action.status) {
            return (
              <LearningData
                processLevelItemId={id}
                processLevelTypeId={processLevelTypeId}
                onActionChange={setAction}
              />
            );
          } else if (!action.status && action.id === 0) {
            return (
              <>
                <NewLearning
                  processLevelItemId={id}
                  processLevelTypeId={processLevelTypeId}
                  onActionChange={setAction}
                />
              </>
            );
          } else {
            return (
              <>
                <LearningDetail
                  id={action.id}
                  processLevelItemId={id}
                  processLevelTypeId={processLevelTypeId}
                  onActionChange={setAction}
                />
              </>
            );
          }
        })()}
      </TabPanel>
    </Box>
  );
};

export default DesignProject;
