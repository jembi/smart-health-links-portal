"use client"

import React, { useState } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';


interface FhirBundle {
  resourceType: string;
  entry: {
    resource: {
      resourceType: string;
      [key: string]: any; // Allow for any other properties on FHIR resources
    };
  }[];
}

interface FhirBundleViewerProps {
  bundleData: FhirBundle;
}

function FhirBundleViewer({ bundleData }: FhirBundleViewerProps) {
  const [activeTab, setActiveTab] = useState(0);

  const groupedResources = bundleData.entry.reduce((acc, entry) => {
    const resourceType = entry.resource.resourceType;
    acc[resourceType] = acc[resourceType] || [];
    acc[resourceType].push(entry.resource);
    return acc;
  }, {} as { [key: string]: any[] }); // Type the accumulator

  const resourceTypes = Object.keys(groupedResources);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        orientation="horizontal" // Set orientation to vertical
        variant="scrollable" // Allow scrolling if needed
        scrollButtons="auto"
        value={activeTab}
        onChange={handleChange}
        aria-label="fhir resource tabs"
      >
        {resourceTypes.map((type, index) => (
          <Tab label={type} key={index} />
        ))}
      </Tabs>

      <Box sx={{ p: 3 }}>
        {resourceTypes.map((type, index) => (
          <Box
            key={index}
            role="tabpanel"
            hidden={activeTab !== index}
            id={`fhir-tabpanel-${index}`}
            aria-labelledby={`fhir-tab-${index}`}
          >
            {activeTab === index && (
              <Box>
                {groupedResources[type].map((resource, resourceIndex) => (
                  <Box key={resourceIndex} sx={{ mb: 2 }}>
                    <div dangerouslySetInnerHTML={{ __html: resource.text.div }} />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default FhirBundleViewer;