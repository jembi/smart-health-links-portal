import { Coding } from 'fhir/r4';

import {
  TType,
  TBundle,
  IResource,
  TSupportedResource,
  EResource,
} from '@/types/fhir.types';

export const extractResource = <TResource extends keyof IResource>(
  bundle: TBundle,
  resourceType: TResource,
) => {
  const filterResourceByType = (type: keyof IResource) =>
    bundle.entry
      ?.filter(({ resource }) => resource.resourceType === type)
      .map(({ resource }) => resource) as TType<TResource>[];

  // Define the dependent resources based on the provided resourceType
  const dependentResources: Record<string, (keyof IResource)[]> = {
    Medication: [EResource.MedicationStatement],
    Composition: [EResource.Patient, EResource.Condition],
  };

  // Get the resources for the specified type
  const resources = filterResourceByType(resourceType);

  // If there are dependent resources for the specified type, fetch them as well
  const dependentResourceTypes = dependentResources[resourceType as string];
  const dependentResourcesData = dependentResourceTypes
    ? dependentResourceTypes.flatMap((type) => filterResourceByType(type))
    : [];

  return [...resources, ...dependentResourcesData];
};

export const getCodings = <TResource extends TSupportedResource>({
  resource,
}: {
  resource: TResource;
}): [string, Coding][] =>
  Object.entries(resource)
    .filter(([, val]) =>
      Array.isArray(val) ? val.some((value) => value.coding) : val.coding,
    )
    .reduce((acc, [key, value]) => {
      if (Array.isArray(value)) {
        acc.push(
          ...value.flatMap((val) =>
            val.coding ? val.coding.map((code) => [key, code]) : [],
          ),
        );
      } else if (value.coding) {
        acc.push(...value.coding.map((code) => [key, code]));
      }
      return acc;
    }, []);

export const camelCaseToFlat = (word: string) =>
  word
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (firstLetter: string) => firstLetter.toUpperCase());
