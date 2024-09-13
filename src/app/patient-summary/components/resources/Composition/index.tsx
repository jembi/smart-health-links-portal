import { camelCaseToFlat, uuid } from '@/app/utils/helpers';
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
            {row.event[0].code[0].coding[0].code}
          </StyledTableCell>
          <StyledTableCell></StyledTableCell>
          <StyledTableCell>
            {row.event[0].code[0].coding[0].system}
          </StyledTableCell>
        </StyledTableRow>,
      ],
      getResource: (datum) => datum,
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
        ).resource.name[0];

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
          references[author[0].reference] as {
            resource: TType<EResource.Practitioner>;
          }
        ).resource;
        const [{ given, family }] = name;
        const [{ code }] = qualification;

        return `${given}, ${family}, ${code.coding[0].display}`;
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

            return `${given}, ${family}, ${code.coding[0].display}`;
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
      renderRow: ({ section }) => <SectionTitle title={section[0].title} />,
    },
  },
  {
    type: 'row',
    config: {
      label: 'Title',
      renderRow: ({ section }) => section[0].title,
    },
  },
  {
    type: 'table',
    config: {
      title: '',
      columns: ['Condition', 'Status', 'Severity'],
      renderRow: ({ row, references, StyledTableRow, StyledTableCell }) => {
        const condition = (
          references[row.section[0].entry[0].reference] as {
            resource: TType<EResource.Condition>;
          }
        ).resource;

        return [
          <StyledTableRow key={uuid()}>
            <StyledTableCell>
              {condition.code.coding[1].display}
            </StyledTableCell>
            <StyledTableCell>
              {condition.clinicalStatus.coding[0].code}
            </StyledTableCell>
            <StyledTableCell>
              {condition.severity.coding[0].display}
            </StyledTableCell>
          </StyledTableRow>,
        ];
      },
      getResource: (datum) => datum,
    },
  },
  {
    type: 'row',
    config: {
      label: '',
      renderRow: ({ section }) => <SectionTitle title={section[1].title} />,
    },
  },
  {
    type: 'row',
    config: {
      label: 'Title',
      renderRow: ({ section }) => section[1].title,
    },
  },
  {
    type: 'table',
    config: {
      title: 'Medication Statements',
      columns: ['Medication', 'Status', 'Period Start', 'Period End'],
      renderRow: ({ row, references, StyledTableRow, StyledTableCell }) => {
        const medicationStatement = (
          references[row.section[1].entry[0].reference] as {
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
              {medication?.code?.coding?.[0].display}
            </StyledTableCell>
            <StyledTableCell>{medicationStatement.status}</StyledTableCell>
            <StyledTableCell>
              {medicationStatement.effectivePeriod.start}
            </StyledTableCell>
          </StyledTableRow>,
        ];
      },
      getResource: (datum) => datum,
    },
  },
  {
    type: 'row',
    config: {
      label: '',
      renderRow: ({ section }) => <SectionTitle title={section[2].title} />,
    },
  },
  {
    type: 'row',
    config: {
      label: 'Title',
      renderRow: ({ section }) => section[2].title,
    },
  },
  {
    type: 'table',
    config: {
      title: '',
      columns: ['Category', 'Display', 'Criticality'],
      renderRow: ({ row, references, StyledTableRow, StyledTableCell }) => {
        const allergyIntolerance = (
          references[row.section[2].entry[0].reference] as {
            resource: TType<EResource.AllergyIntolerance>;
          }
        )?.resource;

        return [
          <StyledTableRow key={uuid()}>
            <StyledTableCell>
              {camelCaseToFlat(`${allergyIntolerance.type} to medication`)}
            </StyledTableCell>
            <StyledTableCell>
              {allergyIntolerance.code.coding?.[0].display}
            </StyledTableCell>
            <StyledTableCell>{allergyIntolerance.criticality}</StyledTableCell>
          </StyledTableRow>,
        ];
      },
      getResource: (datum) => datum,
    },
  },
  {
    type: 'row',
    config: {
      label: '',
      renderRow: ({ section }) => <SectionTitle title={section[3].title} />,
    },
  },
  {
    type: 'row',
    config: {
      label: 'Title',
      renderRow: ({ section }) => section[3].title,
    },
  },
  {
    type: 'table',
    config: {
      title: '',
      columns: ['Condition', 'Status', 'Severity'],
      renderRow: ({ row, references, StyledTableRow, StyledTableCell }) => {
        const condition = (
          references[row.section[3].entry[0].reference] as {
            resource: TType<EResource.Condition>;
          }
        )?.resource;

        return [
          <StyledTableRow key={uuid()}>
            <StyledTableCell>
              {condition.code.coding?.[0].display}
            </StyledTableCell>
            <StyledTableCell>
              {condition.clinicalStatus.coding?.[0].code}
            </StyledTableCell>
            <StyledTableCell>
              {condition.severity.coding?.[0].display}
            </StyledTableCell>
          </StyledTableRow>,
        ];
      },
      getResource: (datum) => datum,
    },
  },
  {
    type: 'row',
    config: {
      label: '',
      renderRow: ({ section }) => <SectionTitle title={section[4].title} />,
    },
  },
  {
    type: 'row',
    config: {
      label: 'Title',
      renderRow: ({ section }) => section[4].title,
    },
  },
  {
    type: 'row',
    config: {
      label: '',
      renderRow: ({ section }) => <SectionTitle title={section[5].title} />,
    },
  },
  {
    type: 'row',
    config: {
      label: 'Title',
      renderRow: ({ section }) => section[5].title,
    },
  },
  {
    type: 'table',
    config: {
      title: '',
      columns: ['Category', 'Code Display', 'Result', 'Status', 'Performed by'],
      renderRow: ({ row, references, StyledTableRow, StyledTableCell }) => {
        const observation = (
          references[row.section[5].entry[0].reference] as {
            resource: TType<EResource.Observation>;
          }
        )?.resource;

        const organization = (
          references[observation.performer[0].reference] as {
            resource: TType<EResource.Organization>;
          }
        )?.resource;

        return [
          <StyledTableRow key={uuid()}>
            <StyledTableCell>
              {observation.category[0].coding[0].code} (text)
            </StyledTableCell>
            <StyledTableCell>{observation.code.text}</StyledTableCell>
            <StyledTableCell>
              {observation.valueQuantity?.value}
            </StyledTableCell>
            <StyledTableCell>{observation.status}</StyledTableCell>
            <StyledTableCell>{organization.name}</StyledTableCell>
          </StyledTableRow>,
        ];
      },
      getResource: (datum) => datum,
    },
  },
];

export const Composition = (props: Omit<TTabProps<TComposition>, 'rows'>) => (
  <TabSection<TComposition> {...props} rows={rows} />
);
