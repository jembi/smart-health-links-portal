"use client";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import fhirBundleJson from "../sample/bundle.json"
import TabPanel from "./TabPanel";
import { useState } from "react";

const dataTabs = Array.from(
  new Set(fhirBundleJson.entry.map((entry) => entry.resource.resourceType))
);

export default function PatientSummary() {
  const [selectedTab, setSelectedTab] = useState(dataTabs[0]);
  const renderPanels = () =>
    dataTabs.map((resourceType) => {
      return (
        <TabPanel value={resourceType} index={selectedTab} key={resourceType}>
          <div>
            Data of <b>{resourceType}</b> will be displayed here.
          </div>
        </TabPanel>
      );
    });
    const renderTabs = () =>
      dataTabs.map((resourceType) => (
        <Tab label={resourceType} key={resourceType} value={resourceType} />
      ));
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={selectedTab} onChange={handleChange} variant="scrollable" scrollButtons="auto"
        >
          {renderTabs()}
        </Tabs>
      </Box>
      {renderPanels()}
    </Box>
  );
}