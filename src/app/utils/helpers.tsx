import {
  ResourceType,
  ResourceMap,
} from "../patient-summary/types/resources.types";

export const extractResourceInfo = <T extends ResourceType>(
  resourceType: T,
  data: any
): T extends keyof ResourceMap ? ResourceMap[T] : undefined => {
  const resource = data.entry?.find(
    (entry: any) => entry.resource.resourceType === resourceType
  )?.resource;

  return resource;
};
