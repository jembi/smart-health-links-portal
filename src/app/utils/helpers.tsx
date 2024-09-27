import { Coding } from 'fhir/r4';
import { v4 as uuidv4, validate } from 'uuid';

import {
  TType,
  TBundle,
  IResource,
  TSupportedResource,
  EResource,
  TSupportedSection,
  EIpsSection,
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
      bundle?.entry?.find((item) => {
        if (
          item.resource?.id &&
          (validate(item.resource.id) ||
            item.resource.id.startsWith('urn:uuid:')) &&
          item.resource.id === reference.split('/')[1]
        ) {
          return true;
        } else if (item.fullUrl === reference) {
          return true;
        }
      }),
    ),
  );
};

export const extractResources = <TResource extends keyof IResource>(
  bundle: TBundle,
  resourceType: TResource,
) => {
  const resources = bundle.entry
    ?.filter(({ resource }) => resource?.resourceType === resourceType)
    .map(({ resource }) => resource) as TType<TResource>[];

  const references = extractLinkedResources(
    bundle,
    bundle?.entry?.map(({ resource }) => resource) as TType<TResource>[],
  )
    .flat()
    .reduce((acc, cur) => {
      if (
        acc &&
        cur?.resource?.resourceType &&
        cur?.resource?.id &&
        (cur.resource.id?.startsWith('urn:uuid:') || validate(cur.resource.id))
      ) {
        const uuid = `${cur.resource.resourceType}/${cur.resource.id}`;
        acc[uuid] = cur;
        return acc;
      }

      if (acc && cur?.fullUrl) {
        const uuid = cur.fullUrl;
        acc[uuid] = cur;
        return acc;
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
  ignoredFields = [],
}: {
  resource: TResource;
  ignoredFields?: (keyof TResource)[];
}): [string, Coding][] =>
  Object.entries(resource)
    .filter(([key, val]) =>
      !ignoredFields.includes(key as keyof TResource) && Array.isArray(val)
        ? val.some((value) => value.coding)
        : val.coding,
    )
    .reduce(
      (acc, [key, value]) => {
        if (Array.isArray(value)) {
          acc.push(
            ...value.flatMap((val) =>
              val.coding ? val.coding?.map((code) => [key, code]) : [],
            ),
          );
        } else if (value?.coding && Array.isArray(value.coding)) {
          const coding: Coding[] = value.coding;
          coding?.forEach((code) => acc.push([key, code]));
        }
        return acc;
      },
      [] as [string, Coding][],
    );

export const camelCaseToFlat = (word: string) =>
  word
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (firstLetter: string) => firstLetter.toUpperCase());

export const periodUnitToText = (str?: string, count?: number) => {
  if (!str) return '';
  const unitMap = {
    s: 'second',
    m: 'minute',
    h: 'hour',
    d: 'day',
    wk: 'week',
    mo: 'month',
    a: 'year',
  };

  return `${count} ${unitMap[str]}${(count || 1) === 1 ? '' : 's'}`;
};

export const getSection = (
  compositionSections: IResource['Composition']['section'],
  section: TSupportedSection,
  ...otherSections: TSupportedSection[]
) =>
  compositionSections?.find(({ title }) => {
    if (title?.startsWith(EIpsSection[section]))
      return title?.startsWith(EIpsSection[section]);

    return otherSections.some((otherSection) =>
      title?.startsWith(EIpsSection[otherSection]),
    );
  });

export const getResource = <TResource extends keyof IResource>(
  references?: Record<
    string,
    {
      resource: TSupportedResource;
    }
  >,
  reference?: string,
) => {
  if (reference && references?.[reference])
    return references[reference]?.resource as TType<TResource>;
};

export const uuid = () => uuidv4();

export const clipboard = async (items: string | Blob) => {
  if (typeof items === 'string') await navigator.clipboard.writeText(items);
  else {
    await navigator.clipboard.write([
      new ClipboardItem({
        [items.type]: items,
      }),
    ]);
  }
};
