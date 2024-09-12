import { TType, TBundle, IDynamicProps } from '../../types/fhir.types';

export const extractResourceInfo = <
  TResource extends IDynamicProps['resource'],
>(
  resourceType: TResource,
  bundle: TBundle,
) => {
  const filterResourceByType = (resourceType) =>
    bundle.entry
      ?.filter(({ resource }) => resource.resourceType === resourceType)
      .map(({ resource }) => resource) as TType<TResource>[];

  return resourceType !== 'Medication'
    ? filterResourceByType(resourceType)
    : [
        ...filterResourceByType(resourceType),
        ...filterResourceByType('MedicationStatement'),
      ];
};
