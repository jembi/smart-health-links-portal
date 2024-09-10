import React from 'react';

import { EResourceType, IResourceType } from '@/types/fhir.types';

import { TTabProps } from '../../generics/resource.types';
import { TabSection } from '../../generics/TabSection';

export const AllergyIntolerance = <
  K extends EResourceType.AllergyIntolerance,
  T extends IResourceType[K],
>(
  props: TTabProps<T>,
) => <TabSection<K, T> {...props} />;
