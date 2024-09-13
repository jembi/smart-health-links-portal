import { Coding } from 'fhir/r4';
import { v4 as uuidv4 } from 'uuid';

import {
  TType,
  TBundle,
  IResource,
  TSupportedResource,
  EResource,
} from '@/types/fhir.types';

export const findResourceReferences = <TResource extends TSupportedResource>({
  resource,
}: {
  resource: TResource;
}): string[] => {
  const references = new Set<string>();

  const findReferences = (obj) => {
    if (obj && typeof obj === 'object') {
      if (obj.reference && typeof obj.reference === 'string') {
        references.add(obj.reference);
      }
      (Array.isArray(obj) ? obj : Object.values(obj)).forEach(findReferences);
    }
  };

  findReferences(resource);
  return Array.from(references);
};

export const extractLinkedResources = <TResource extends keyof IResource>(
  bundle: TBundle,
  resources: TType<EResource>[],
) => {
  return resources.map((resource) =>
    findResourceReferences({
      resource: resource as TType<TResource>,
    }).map((reference) =>
      bundle.entry.find((item) => item.resource.id === reference.split('/')[1]),
    ),
  );
};

export const extractResources = <TResource extends keyof IResource>(
  bundle: TBundle,
  resourceType: TResource,
) => {
  const resources = bundle.entry
    ?.filter(({ resource }) => resource.resourceType === resourceType)
    .map(({ resource }) => resource) as TType<TResource>[];

  const references = extractLinkedResources(
    bundle,
    bundle.entry.map(({ resource }) => resource) as TType<TResource>[],
  )
    .flatMap((subArray) => subArray)
    .reduce((acc, cur) => {
      const uuid = `${cur.resource.resourceType}/${cur.resource.id}`;
      if (!acc[uuid]) {
        acc[uuid] = cur;
      }
      return acc;
    }, {}) as Record<string, TType<TResource>>;

  return {
    resources,
    references,
  };
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

export const periodUnitToText = (str: string) => {
  const unitMap = {
    s: 'second',
    m: 'minute',
    h: 'hour',
    d: 'day',
    wk: 'week',
    mo: 'month',
    a: 'annual',
  };

  return unitMap[str];
};

export const uuid = () => uuidv4();
