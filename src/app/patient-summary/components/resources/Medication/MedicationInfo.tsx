import React from 'react';

import { IResourceType } from '@/types/fhir.types';

import MedicationDetails from './MedicationDetails';

export default function MedicationInfo({
  data,
}: {
  data: IResourceType['Medication'];
}) {
  return <MedicationDetails medicationDetails={data} />;
}
