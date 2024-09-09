import {
  TType,
  TBundle,
  IDynamicProps,
} from '../patient-summary/types/fhir.types';

export const extractResourceInfo = <
  TResource extends IDynamicProps['resource'],
>(
  resourceType: TResource,
  bundle: TBundle,
) =>
  bundle.entry
    ?.filter(({ resource }) => resource.resourceType === resourceType)
    .map(({ resource }) => resource) as TType<TResource>[];
