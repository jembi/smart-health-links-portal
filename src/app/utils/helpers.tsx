import {
  ResourceType,
  ResourceMap,
} from '../patient-summary/types/resources.types';

export const extractResourceInfo = <T extends ResourceType>(
  resourceType: T,
  data: any,
): T extends keyof ResourceMap ? ResourceMap[T][] : undefined => {
  const resource = data.entry
    ?.filter((entry: any) => entry.resource.resourceType === resourceType)
    .map((resource) => resource.resource);

  return resource;
};
