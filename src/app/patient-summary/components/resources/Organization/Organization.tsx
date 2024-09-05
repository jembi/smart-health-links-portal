import { StyledSectionTypography } from '@/app/components/typography/StyledTypography';
import InfoRow from '../../InfoRow';
import ConnectionDetails from '../Patient/ConnectionDetails';
import { Organization as OrganizationType } from '@/app/patient-summary/types/resources/organisation.types';

export default function Organization({ data }: { data: OrganizationType[] }) {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }
  return data.map((organizationInfo, index) => (
    <>
      <StyledSectionTypography key={index}>
        Organization ({index + 1})
      </StyledSectionTypography>
      <InfoRow label="Name" value={organizationInfo.name} />
      <ConnectionDetails resourceInfo={organizationInfo} />
    </>
  ));
}
