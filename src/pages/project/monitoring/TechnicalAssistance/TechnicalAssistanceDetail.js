import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";
import MonthlyUpdate from "./MonthlyUpdate";
import EditMonthlyUpdate from "./EditMonthlyUpdate";
import QuarterlyUpdate from "./QuarterlyUpdate";
import EditQuarterlyUpdate from "./EditQuarterlyUpdate";
import KMDocumentsUpload from "./KMDocumentsUpload";
import MonthlyUpdateDataGrid from "./MonthlyUpdateDataGrid";
import QuarterlyUpdateDataGrid from "./QuarterlyUpdateDataGrid";

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

const TechnicalAssistanceDetail = (props) => {
  const [technicalAssistanceAction, setTechnicalAssistanceAction] =
    React.useState({ id: 0, status: true, data: {} });

  const [value, setValue] = React.useState(0);
  let { id } = useParams();
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
        <Tab label="Monthly Update" {...a11yProps(0)} />
        <Tab label="Quarterly Update" {...a11yProps(1)} />
        <Tab label="KM Documents Upload" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        {(() => {
          if (technicalAssistanceAction.status) {
            return (
              <MonthlyUpdateDataGrid
                id={props.id}
                processLevelItemId={props.processLevelItemId}
                processLevelTypeId={props.processLevelTypeId}
                onActionChange={props.onActionChange}
                onTechnicalAssistanceActionChange={setTechnicalAssistanceAction}
              />
            );
          } else if (
            !technicalAssistanceAction.status &&
            technicalAssistanceAction.id === 0
          ) {
            return (
              <>
                <MonthlyUpdate
                  id={props.id}
                  processLevelItemId={props.processLevelItemId}
                  processLevelTypeId={props.processLevelTypeId}
                  onTechnicalAssistanceActionChange={
                    setTechnicalAssistanceAction
                  }
                />
              </>
            );
          } else {
            return (
              <>
                <EditMonthlyUpdate
                  id={technicalAssistanceAction.id}
                  processLevelItemId={props.processLevelItemId}
                  processLevelTypeId={props.processLevelTypeId}
                  onTechnicalAssistanceActionChange={
                    setTechnicalAssistanceAction
                  }
                />
              </>
            );
          }
        })()}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {(() => {
          if (technicalAssistanceAction.status) {
            return (
              <QuarterlyUpdateDataGrid
                id={props.id}
                processLevelItemId={props.processLevelItemId}
                processLevelTypeId={props.processLevelTypeId}
                onActionChange={props.onActionChange}
                onTechnicalAssistanceActionChange={setTechnicalAssistanceAction}
              />
            );
          } else if (
            !technicalAssistanceAction.status &&
            technicalAssistanceAction.id === 0
          ) {
            return (
              <>
                <QuarterlyUpdate
                  id={props.id}
                  processLevelItemId={props.processLevelItemId}
                  processLevelTypeId={props.processLevelTypeId}
                  onTechnicalAssistanceActionChange={
                    setTechnicalAssistanceAction
                  }
                />
              </>
            );
          } else {
            return (
              <>
                <EditQuarterlyUpdate
                  id={technicalAssistanceAction.id}
                  processLevelItemId={props.processLevelItemId}
                  processLevelTypeId={props.processLevelTypeId}
                  onTechnicalAssistanceActionChange={
                    setTechnicalAssistanceAction
                  }
                />
              </>
            );
          }
        })()}
      </TabPanel>
      <TabPanel value={value} index={2}>
        <KMDocumentsUpload
          id={technicalAssistanceAction.id}
          processLevelItemId={props.processLevelItemId}
          processLevelTypeId={props.processLevelTypeId}
          onTechnicalAssistanceActionChange={setTechnicalAssistanceAction}
        />
      </TabPanel>
    </Box>
  );
};

export default TechnicalAssistanceDetail;
