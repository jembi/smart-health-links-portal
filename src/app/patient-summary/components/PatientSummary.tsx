'use client';
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabPanel from './TabPanel';
import { useState } from 'react';
import Patient from './resources/Patient/Patient';
import { extractResourceInfo } from '@/app/utils/helpers';
import { ResourceType } from '../types/resources.types';

export default function PatientSummary({ fhirBundle }) {
  const dataTabs: string[] = Array.from(
    new Set(fhirBundle.entry.map((entry) => entry.resource.resourceType)),
  );
  const [selectedTab, setSelectedTab] = useState(dataTabs[0] || '');
  const renderPanels = () =>
    dataTabs.map((resourceType) => {
      const resourceInfo = extractResourceInfo(
        ResourceType[resourceType],
        fhirBundle,
      );

      return (
        <TabPanel value={resourceType} index={selectedTab} key={resourceType}>
          {/* TODO: Consider enhancing the conditional rendering of resources */}
          {resourceType === 'Patient' ? (
            <Patient patientInfo={resourceInfo} />
          ) : (
            <div>
              Data of <b>{resourceType}</b> will be displayed here.
            </div>
          )}
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
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {renderTabs()}
        </Tabs>
      </Box>
      {renderPanels()}
    </Box>
  );
}
