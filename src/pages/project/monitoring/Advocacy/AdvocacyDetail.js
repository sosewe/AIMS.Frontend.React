import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";
import KMDocumentsUpload from "./KMDocumentsUpload";
import AdvocacyDataGrid from "./AdvocacyUpdateDataGrid";
import EditAdvocacyUpdate from "./EditAdvocacyUpdate";
import AdvocacyUpdate from "./AdvocacyUpdate";
import AdvocacyProgressUpdateDataGrid from "./AdvocacyUpdateDataGrid";

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

const AdvocacyDetail = (props) => {
  const [advocacyAction, setAdvocacyAction] = React.useState({
    id: 0,
    status: true,
    data: {},
  });
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
        <Tab label="Advocacy Update" {...a11yProps(0)} />
        <Tab label="KM Documents Upload" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        {(() => {
          if (advocacyAction.status) {
            return (
              <AdvocacyProgressUpdateDataGrid
                id={props.id}
                processLevelItemId={props.processLevelItemId}
                processLevelTypeId={props.processLevelTypeId}
                onActionChange={props.onActionChange}
                onAdvocacyActionChange={setAdvocacyAction}
              />
            );
          } else if (!advocacyAction.status && advocacyAction.id === 0) {
            return (
              <>
                <AdvocacyUpdate
                  id={props.id}
                  processLevelItemId={props.processLevelItemId}
                  processLevelTypeId={props.processLevelTypeId}
                  onAdvocacyActionChange={setAdvocacyAction}
                />
              </>
            );
          } else {
            return (
              <>
                <EditAdvocacyUpdate
                  id={advocacyAction.id}
                  processLevelItemId={props.processLevelItemId}
                  processLevelTypeId={props.processLevelTypeId}
                  onAdvocacyActionChange={setAdvocacyAction}
                />
              </>
            );
          }
        })()}
      </TabPanel>
      <TabPanel value={value} index={1}>
        <KMDocumentsUpload
          id={advocacyAction.id}
          processLevelItemId={props.processLevelItemId}
          processLevelTypeId={props.processLevelTypeId}
          onAdvocacyActionChange={setAdvocacyAction}
        />
      </TabPanel>
    </Box>
  );
};

export default AdvocacyDetail;
