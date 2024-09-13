'use client';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import * as React from 'react';
import { useState } from 'react';

import { extractResources } from '@/app/utils/helpers';
import { IResource, TBundle } from '@/types/fhir.types';

import { COMPONENT_MAP } from './generics/constants';
import TabPanel from './TabPanel';

export default function PatientSummary({
  fhirBundle,
}: {
  fhirBundle: TBundle;
}) {
  const dataTabs: string[] = Array.from(
    new Set(fhirBundle.entry.map((entry) => entry.resource.resourceType)),
  );
  const [selectedTab, setSelectedTab] = useState(String(dataTabs[0]));
  const renderPanels = () =>
    dataTabs
      .filter((tab) => Object.keys(COMPONENT_MAP).includes(tab))
      .map((resourceType: keyof IResource) => {
        if (COMPONENT_MAP[resourceType]) {
          const { Component, ...rest } = COMPONENT_MAP[resourceType];
          const { resources, references } = extractResources(
            fhirBundle,
            resourceType,
          );

          return (
            <TabPanel
              value={resourceType}
              index={selectedTab}
              key={resourceType}
            >
              {
                <Component
                  resources={resources}
                  references={references}
                  {...rest}
                />
              }
            </TabPanel>
          );
        }
      });
  const renderTabs = () =>
    dataTabs
      .filter((tab) => Object.keys(COMPONENT_MAP).includes(tab))
      .map((resourceType: keyof IResource) => (
        <Tab
          label={COMPONENT_MAP[resourceType].title}
          key={resourceType}
          value={resourceType}
        />
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
