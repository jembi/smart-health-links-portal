import { Coding } from 'fhir/r4';

import {
  TType,
  TBundle,
  IDynamicProps,
  EResourceType,
} from '@/types/fhir.types';

export const extractResourceInfo = <
  TResource extends IDynamicProps['resource'],
>(
  resourceType: TResource,
  bundle: TBundle,
) =>
  bundle.entry
    ?.filter(({ resource }) => resource.resourceType === resourceType)
    .map(({ resource }) => resource) as TType<TResource>[];

export const getCodings = <TResource extends TType<EResourceType>>({
  resource,
}: {
  resource: TResource;
}): Partial<Record<keyof TResource, Coding>>[] =>
  Object.entries(resource)
    .filter(([, val]) =>
      Array.isArray(val) ? val.some((value) => value.coding) : val.coding,
    )
    .reduce((acc, [key, value]) => {
      if (Array.isArray(value)) {
        acc.push(
          ...value.flatMap((val) =>
            val.coding ? val.coding.map((code) => ({ [key]: code })) : [],
          ),
        );
      } else if (value.coding) {
        acc.push(...value.coding.map((code) => ({ [key]: code })));
      }
      return acc;
    }, []);

export const camelToFlat = (word: string) =>
  word
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (firstLetter: string) => firstLetter.toUpperCase());
