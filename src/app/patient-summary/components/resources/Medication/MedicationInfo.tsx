import React from 'react';

import { IResource } from '@/types/fhir.types';

import MedicationDetails from './MedicationDetails';

export default function MedicationInfo({
  data,
}: {
  data: IResource['Medication'];
}) {
  return <MedicationDetails medicationDetails={data} />;
}
