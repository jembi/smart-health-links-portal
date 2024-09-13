import { camelCaseToFlat, findSectionByTitle, uuid } from '@/app/utils/helpers';
import { EResource, TType } from '@/types/fhir.types';

import { TRow, TTabProps } from '../../generics/resource.types';
import { SectionTitle, TabSection } from '../../generics/TabSection';

type TComposition = TType<EResource.Composition>;

const rows: TRow<TComposition>[] = [
  {
    type: 'row',
    config: { field: 'title', label: 'Title' },
  },
  {
    type: 'row',
    config: { field: 'date', label: 'date' },
  },
  {
    type: 'row',
    config: { field: 'status', label: 'Status' },
  },
  {
    type: 'row',
    config: {
      label: 'Event Period',
      renderRow: ({ date }) => `End: ${date}`,
    },
  },
  {
    type: 'table',
    config: {
      title: 'Event Details',
      columns: ['Code', 'Display', 'System'],
      renderRow: ({ row, StyledTableRow, StyledTableCell }) => [
        <StyledTableRow key={uuid()}>
          <StyledTableCell>
            {row.event?.[0].code?.[0].coding?.[0].code}
          </StyledTableCell>
          <StyledTableCell>
            {row.event?.[0].code?.[0].coding?.[0].display}
          </StyledTableCell>
          <StyledTableCell>
            {row.event?.[0].code?.[0].coding?.[0].system}
          </StyledTableCell>
        </StyledTableRow>,
      ],
    },
  },
  {
    type: 'row',
    config: {
      label: 'Patient',
      renderRow: ({ subject }, references) => {
        const { given, family } = (
          references[subject.reference] as {
            resource: TType<EResource.Patient>;
          }
        ).resource.name?.[0];

        return `${given}, ${family}`;
      },
    },
  },
  {
    type: 'row',
    config: {
      label: 'Author',
      renderRow: ({ author }, references) => {
        const { name, qualification } = (
          references[author?.[0]?.reference] as {
            resource: TType<EResource.Practitioner>;
          }
        ).resource;
        const [{ given, family }] = name;
        const [{ code }] = qualification;

        return `${given}, ${family}, ${code.coding?.[0]?.display}`;
      },
    },
  },
  {
    type: 'row',
    config: {
      label: 'Attester',
      renderRow: ({ attester }, references) => {
        return attester.map((attesterItem) => {
          if (attesterItem.party.reference.startsWith(EResource.Practitioner)) {
            const { name, qualification } = (
              references[attesterItem.party.reference] as {
                resource: TType<EResource.Practitioner>;
              }
            ).resource;
            const [{ given, family }] = name;
            const [{ code }] = qualification;

            return `${given}, ${family}, ${code.coding?.[0]?.display}`;
          } else if (
            attesterItem.party.reference.startsWith(EResource.Organization)
          ) {
            return (
              references[attesterItem.party.reference] as {
                resource: TType<EResource.Organization>;
              }
            ).resource.name;
          }
        });
      },
    },
  },
  {
    type: 'row',
    config: {
      label: 'Custodian',
      renderRow: ({ custodian }, references) =>
        (
          references[custodian.reference] as {
            resource: TType<EResource.Organization>;
          }
        ).resource.name,
    },
  },
  {
    type: 'row',
    config: {
      label: '',
      renderRow: ({ section }) => (
        <SectionTitle
          title={findSectionByTitle(section, 'Active Problems').title}
        />
      ),
    },
  },
  {
    type: 'row',
    config: {
      label: 'Title',
      renderRow: ({ section }) =>
        findSectionByTitle(section, 'Active Problems').title,
    },
  },
  {
    type: 'table',
    config: {
      title: '',
      columns: ['Condition', 'Status', 'Severity'],
      renderRow: ({ row, references, StyledTableRow, StyledTableCell }) => {
        const condition = (
          references[
            findSectionByTitle(row.section, 'Active Problems').entry?.[0]
              ?.reference
          ] as {
            resource: TType<EResource.Condition>;
          }
        ).resource;

        return [
          <StyledTableRow key={uuid()}>
            <StyledTableCell>
              {condition.code?.coding?.[0]?.display}
            </StyledTableCell>
            <StyledTableCell>
              {condition.clinicalStatus?.coding?.[0]?.code}
            </StyledTableCell>
            <StyledTableCell>
              {condition.severity?.coding?.[0]?.display}
            </StyledTableCell>
          </StyledTableRow>,
        ];
      },
    },
  },
  {
    type: 'row',
    config: {
      label: '',
      renderRow: ({ section }) => (
        <SectionTitle title={findSectionByTitle(section, 'Medication').title} />
      ),
    },
  },
  {
    type: 'row',
    config: {
      label: 'Title',
      renderRow: ({ section }) =>
        findSectionByTitle(section, 'Medication').title,
    },
  },
  {
    type: 'table',
    config: {
      title: 'Medication Statements',
      columns: ['Medication', 'Status', 'Period Start', 'Period End'],
      renderRow: ({ row, references, StyledTableRow, StyledTableCell }) => {
        const medicationStatement = (
          references[
            findSectionByTitle(row.section, 'Medication').entry?.[0]?.reference
          ] as {
            resource: TType<EResource.MedicationStatement>;
          }
        )?.resource;

        const medication = (
          references[medicationStatement.medicationReference.reference] as {
            resource: TType<EResource.Medication>;
          }
        )?.resource;

        return [
          <StyledTableRow key={uuid()}>
            <StyledTableCell>
              {medication?.code?.coding?.[0]?.display}
            </StyledTableCell>
            <StyledTableCell>{medicationStatement.status}</StyledTableCell>
            <StyledTableCell>
              {medicationStatement.effectivePeriod.start}
            </StyledTableCell>
          </StyledTableRow>,
        ];
      },
    },
  },
  {
    type: 'row',
    config: {
      label: '',
      renderRow: ({ section }) => (
        <SectionTitle
          title={
            findSectionByTitle(section, 'Allergies and Intolerances').title
          }
        />
      ),
    },
  },
  {
    type: 'row',
    config: {
      label: 'Title',
      renderRow: ({ section }) =>
        findSectionByTitle(section, 'Allergies and Intolerances').title,
    },
  },
  {
    type: 'table',
    config: {
      title: '',
      columns: ['Category', 'Display', 'Criticality'],
      renderRow: ({ row, references, StyledTableRow, StyledTableCell }) => {
        const allergyIntolerance = (
          references[
            findSectionByTitle(row.section, 'Allergies and Intolerances')
              .entry[0].reference
          ] as {
            resource: TType<EResource.AllergyIntolerance>;
          }
        )?.resource;

        return [
          <StyledTableRow key={uuid()}>
            <StyledTableCell>
              {camelCaseToFlat(`${allergyIntolerance.type} to medication`)}
            </StyledTableCell>
            <StyledTableCell>
              {allergyIntolerance.code?.coding?.[0]?.display}
            </StyledTableCell>
            <StyledTableCell>{allergyIntolerance.criticality}</StyledTableCell>
          </StyledTableRow>,
        ];
      },
    },
  },
  {
    type: 'row',
    config: {
      label: '',
      renderRow: ({ section }) => (
        <SectionTitle
          title={findSectionByTitle(section, 'History of Past Illness').title}
        />
      ),
    },
  },
  {
    type: 'row',
    config: {
      label: 'Title',
      renderRow: ({ section }) =>
        findSectionByTitle(section, 'History of Past Illness').title,
    },
  },
  {
    type: 'table',
    config: {
      title: '',
      columns: ['Condition', 'Status', 'Severity'],
      renderRow: ({ row, references, StyledTableRow, StyledTableCell }) => {
        const condition = (
          references[
            findSectionByTitle(row.section, 'History of Past Illness').entry[0]
              .reference
          ] as {
            resource: TType<EResource.Condition>;
          }
        )?.resource;

        return [
          <StyledTableRow key={uuid()}>
            <StyledTableCell>
              {condition.code?.coding?.[0]?.display}
            </StyledTableCell>
            <StyledTableCell>
              {condition.clinicalStatus?.coding?.[0]?.code}
            </StyledTableCell>
            <StyledTableCell>
              {condition.severity?.coding?.[0]?.display}
            </StyledTableCell>
          </StyledTableRow>,
        ];
      },
    },
  },
  {
    type: 'row',
    config: {
      label: '',
      renderRow: ({ section }) => (
        <SectionTitle
          title={findSectionByTitle(section, 'Plan of Treatment').title}
        />
      ),
    },
  },
  {
    type: 'row',
    config: {
      label: 'Title',
      renderRow: ({ section }) =>
        findSectionByTitle(section, 'Plan of Treatment').title,
    },
  },
  {
    type: 'row',
    config: {
      label: '',
      renderRow: ({ section }) => (
        <SectionTitle title={findSectionByTitle(section, 'Results').title} />
      ),
    },
  },
  {
    type: 'row',
    config: {
      label: 'Title',
      renderRow: ({ section }) => findSectionByTitle(section, 'Results').title,
    },
  },
  {
    type: 'table',
    config: {
      title: '',
      columns: ['Category', 'Code Display', 'Result', 'Status', 'Performed by'],
      renderRow: ({ row, references, StyledTableRow, StyledTableCell }) => {
        const observation = (
          references[
            findSectionByTitle(row.section, 'Results').entry?.[0]?.reference
          ] as {
            resource: TType<EResource.Observation>;
          }
        )?.resource;

        const organization = (
          references[observation.performer?.[0]?.reference] as {
            resource: TType<EResource.Organization>;
          }
        )?.resource;

        return [
          <StyledTableRow key={uuid()}>
            <StyledTableCell>
              {observation.category?.[0]?.coding?.[0]?.code} (text)
            </StyledTableCell>
            <StyledTableCell>{observation.code?.text}</StyledTableCell>
            <StyledTableCell>
              {observation.valueQuantity?.value}
            </StyledTableCell>
            <StyledTableCell>{observation.status}</StyledTableCell>
            <StyledTableCell>{organization.name}</StyledTableCell>
          </StyledTableRow>,
        ];
      },
    },
  },
];

export const Composition = (props: Omit<TTabProps<TComposition>, 'rows'>) => (
  <TabSection<TComposition> {...props} rows={rows} />
);
