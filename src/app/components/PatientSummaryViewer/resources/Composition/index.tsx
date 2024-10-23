import Box from '@mui/material/Box';
import { JSX } from 'react';

import { StyledButton } from '@/app/components/StyledButton';
import {
  camelCaseToFlat,
  getSection,
  getResource,
  uuid,
} from '@/app/utils/helpers';
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
    config: { field: 'date', label: 'Date' },
  },
  {
    type: 'row',
    config: { field: 'status', label: 'Status' },
  },
  {
    type: 'row',
    config: {
      label: 'Event Period',
      render: ({ date, event }) => date && event?.[0] && `End: ${date}`,
    },
  },
  {
    type: 'table',
    config: {
      title: 'Event Details',
      columns: ['Code', 'Display', 'System'],
      render: ({ row, StyledTableRow, StyledTableCell }) =>
        row.event?.[0]
          ? [
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
            ]
          : [],
    },
  },
  {
    type: 'row',
    config: {
      label: 'Patient',
      render: ({ subject }, references) => {
        const { name } =
          getResource<EResource.Patient>(references, subject?.reference) || {};

        return [name?.[0].given?.flat().join(' '), name?.[0].family]
          .filter((name) => !!name)
          .join(', ');
      },
    },
  },
  {
    type: 'row',
    config: {
      label: 'Author',
      render: ({ author }, references) => {
        const { name, qualification } =
          getResource<EResource.Practitioner>(
            references,
            author?.[0]?.reference,
          ) || {};

        const authorText = [
          name?.[0].given,
          name?.[0].family,
          qualification?.[0].code.coding?.[0]?.display,
        ]
          .filter((name) => !!name)
          .join(', ');

        return (
          authorText && (
            <>
              {name?.[0].prefix}
              {authorText}
            </>
          )
        );
      },
    },
  },
  {
    type: 'row',
    config: {
      label: 'Attester',
      render: ({ attester }, references) => {
        return attester?.map((attesterItem) => {
          if (
            attesterItem?.party?.reference?.startsWith(EResource.Practitioner)
          ) {
            const { name, qualification } =
              getResource<EResource.Practitioner>(
                references,
                attesterItem.party.reference,
              ) || {};

            return (
              name?.[0] &&
              qualification?.[0] &&
              `${name?.[0].given}, ${name?.[0].family}, ${qualification?.[0].code.coding?.[0]?.display}`
            );
          } else if (
            attesterItem?.party?.reference?.startsWith(EResource.Organization)
          ) {
            return getResource<EResource.Organization>(
              references,
              attesterItem.party.reference,
            )?.name;
          }
        });
      },
    },
  },
  {
    type: 'row',
    config: {
      label: 'Custodian',
      render: ({ custodian }, references) =>
        getResource<EResource.Organization>(references, custodian?.reference)
          ?.name,
    },
  },
  {
    type: 'row',
    config: {
      render: ({ section }) => (
        <SectionTitle
          title={getSection(section, 'ActiveProblems', 'ProblemList')?.title}
        />
      ),
    },
  },
  {
    type: 'row',
    config: {
      label: 'Title',
      render: ({ section }) =>
        getSection(section, 'ActiveProblems', 'ProblemList')?.title,
    },
  },
  {
    type: 'table',
    config: {
      columns: ['Condition', 'Status', 'Severity'],
      render: ({ row, references, StyledTableRow, StyledTableCell }) =>
        getSection(row.section, 'ActiveProblems', 'ProblemList')?.entry?.reduce(
          (entryItems, { reference }) => {
            const condition = getResource<EResource.Condition>(
              references,
              reference,
            );

            return [
              ...entryItems,
              condition
                ? [
                    <StyledTableRow key={uuid()}>
                      {[
                        condition.code?.coding?.[0]?.display,
                        condition.clinicalStatus?.coding?.[0]?.code,
                        condition.severity?.coding?.[0]?.display,
                      ].map((cell) => (
                        <StyledTableCell key={uuid()}>{cell}</StyledTableCell>
                      ))}
                    </StyledTableRow>,
                  ]
                : [],
            ];
          },
          [] as JSX.Element[][],
        ) as JSX.Element[][],
    },
  },
  {
    type: 'row',
    config: {
      render: ({ section }) => (
        <SectionTitle title={getSection(section, 'VitalSigns')?.title} />
      ),
    },
  },
  {
    type: 'row',
    config: {
      label: 'Title',
      render: ({ section }) => getSection(section, 'VitalSigns')?.title,
    },
  },
  {
    type: 'table',
    config: {
      columns: ['Category', 'Code Display', 'Result', 'Status'],
      render: ({ row, references, StyledTableRow, StyledTableCell }) =>
        getSection(row.section, 'VitalSigns')?.entry?.reduce(
          (entryItems, { reference }) => {
            const observation = getResource<EResource.Observation>(
              references,
              reference,
            );

            return [
              ...entryItems,
              observation
                ? [
                    <StyledTableRow key={uuid()}>
                      {[
                        observation.category?.[0].coding?.[0]?.code,
                        observation.code?.coding?.[0]?.display,
                        `${observation?.valueQuantity?.value} ${observation?.valueQuantity?.unit}`,
                        observation.status,
                      ].map((cell) => (
                        <StyledTableCell key={uuid()}>{cell}</StyledTableCell>
                      ))}
                    </StyledTableRow>,
                  ]
                : [],
            ];
          },
          [] as JSX.Element[][],
        ) as JSX.Element[][],
    },
  },
  {
    type: 'row',
    config: {
      render: ({ section }) => (
        <SectionTitle title={getSection(section, 'Medication')?.title} />
      ),
    },
  },
  {
    type: 'row',
    config: {
      label: 'Title',
      render: ({ section }) => getSection(section, 'Medication')?.title,
    },
  },
  {
    type: 'table',
    config: {
      title: 'Medication Statements',
      columns: ['Medication', 'Status', 'Period Start', 'Period End'],
      render: ({ row, references, StyledTableRow, StyledTableCell }) =>
        getSection(row.section, 'Medication')?.entry?.reduce(
          (entryItems, { reference }) => {
            const {
              medicationReference,
              status,
              effectivePeriod,
              effectiveDateTime,
            } =
              getResource<EResource.MedicationStatement>(
                references,
                reference,
              ) || {};
            const { code } =
              getResource<EResource.Medication>(
                references,
                medicationReference?.reference,
              ) || {};

            return [
              ...entryItems,
              [
                <StyledTableRow key={uuid()}>
                  <StyledTableCell>
                    {code?.coding?.[0]?.display}
                  </StyledTableCell>
                  <StyledTableCell>{status}</StyledTableCell>
                  <StyledTableCell>
                    {effectivePeriod?.start || effectiveDateTime}
                  </StyledTableCell>
                  <StyledTableCell>{effectivePeriod?.end}</StyledTableCell>
                </StyledTableRow>,
              ],
            ];
          },
          [] as JSX.Element[][],
        ) as JSX.Element[][],
    },
  },
  {
    type: 'row',
    config: {
      render: ({ section }) => (
        <SectionTitle
          title={getSection(section, 'AllergiesAndIntolerances')?.title}
        />
      ),
    },
  },
  {
    type: 'row',
    config: {
      label: 'Title',
      render: ({ section }) =>
        getSection(section, 'AllergiesAndIntolerances')?.title,
    },
  },
  {
    type: 'table',
    config: {
      columns: ['Category', 'Display', 'Criticality'],
      render: ({ row, references, StyledTableRow, StyledTableCell }) => {
        const { entry } =
          getSection(row.section, 'AllergiesAndIntolerances') || {};
        const { type, code, criticality } =
          getResource<EResource.AllergyIntolerance>(
            references,
            entry?.[0]?.reference,
          ) || {};

        return [
          <StyledTableRow key={uuid()}>
            <StyledTableCell>
              {type && camelCaseToFlat(`${type} to medication`)}
            </StyledTableCell>
            <StyledTableCell>{code?.coding?.[0]?.display}</StyledTableCell>
            <StyledTableCell>{criticality}</StyledTableCell>
          </StyledTableRow>,
        ];
      },
    },
  },
  {
    type: 'row',
    config: {
      render: ({ section }) => (
        <SectionTitle
          title={getSection(section, 'HistoryOfPastIllness')?.title}
        />
      ),
    },
  },
  {
    type: 'row',
    config: {
      label: 'Title',
      render: ({ section }) =>
        getSection(section, 'HistoryOfPastIllness')?.title,
    },
  },
  {
    type: 'table',
    config: {
      columns: ['Condition', 'Status', 'Severity'],
      render: ({ row, references, StyledTableRow, StyledTableCell }) =>
        getSection(row.section, 'HistoryOfPastIllness')?.entry?.reduce(
          (entryItems, { reference }) => {
            const { code, clinicalStatus, severity } =
              getResource<EResource.Condition>(references, reference) || {};

            return [
              ...entryItems,
              [
                <StyledTableRow key={uuid()}>
                  {[
                    code?.coding?.[0]?.display,
                    clinicalStatus?.coding?.[0]?.code,
                    severity?.coding?.[0]?.display,
                  ].map((cell) => (
                    <StyledTableCell key={uuid()}>{cell}</StyledTableCell>
                  ))}
                </StyledTableRow>,
              ],
            ];
          },
          [] as JSX.Element[][],
        ) as JSX.Element[][],
    },
  },
  {
    type: 'row',
    config: {
      render: ({ section }) => (
        <SectionTitle title={getSection(section, 'PlanOfTreatment')?.title} />
      ),
    },
  },
  {
    type: 'row',
    config: {
      label: 'Title',
      render: ({ section }) => getSection(section, 'PlanOfTreatment')?.title,
    },
  },
  {
    type: 'row',
    config: {
      render: ({ section }) => (
        <SectionTitle title={getSection(section, 'Results')?.title} />
      ),
    },
  },
  {
    type: 'row',
    config: {
      label: 'Title',
      render: ({ section }) => getSection(section, 'Results')?.title,
    },
  },
  {
    type: 'table',
    config: {
      columns: ['Category', 'Code Display', 'Result', 'Status', 'Performed by'],
      render: ({ row, references, StyledTableRow, StyledTableCell }) =>
        getSection(row.section, 'Results')?.entry?.reduce(
          (entryItems, { reference }) => {
            const {
              performer,
              category,
              code,
              valueQuantity,
              valueCodeableConcept,
              status,
            } = getResource<EResource.Observation>(references, reference) || {};
            const { name } =
              getResource<EResource.Organization>(
                references,
                performer?.[0]?.reference,
              ) || {};

            return [
              ...entryItems,
              [
                <StyledTableRow key={uuid()}>
                  <StyledTableCell>
                    {category?.[0]?.coding?.[0]?.code} {code?.text && '(text)'}
                  </StyledTableCell>
                  <StyledTableCell>
                    {code?.text || code?.coding?.[0].display}
                  </StyledTableCell>
                  <StyledTableCell>
                    {valueQuantity?.value &&
                      `${valueQuantity.value} ${valueQuantity.unit}`}
                    {valueCodeableConcept?.coding?.[0].display}
                  </StyledTableCell>
                  <StyledTableCell>{status}</StyledTableCell>
                  <StyledTableCell>{name}</StyledTableCell>
                </StyledTableRow>,
              ],
            ];
          },
          [] as JSX.Element[][],
        ) as JSX.Element[][],
    },
  },
  {
    type: 'row',
    config: {
      render: ({ section }) => (
        <SectionTitle title={getSection(section, 'Immunization')?.title} />
      ),
    },
  },
  {
    type: 'row',
    config: {
      label: 'Title',
      render: ({ section }) => getSection(section, 'Immunization')?.title,
    },
  },
  {
    type: 'table',
    config: {
      columns: [
        'Immunization',
        'Note',
        'Status',
        'Occurrence Date Time',
        'Performed by',
      ],
      render: ({ row, references, StyledTableRow, StyledTableCell }) =>
        getSection(row.section, 'Immunization')?.entry?.reduce(
          (entryItems, { reference }) => {
            const { note, status, occurrenceDateTime, performer } =
              getResource<EResource.Immunization>(references, reference) || {};

            const { name } =
              getResource<EResource.Organization>(
                references,
                performer?.[0].actor.reference,
              ) || {};

            return [
              ...entryItems,
              [
                <StyledTableRow key={uuid()}>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell>{note?.[0].text}</StyledTableCell>
                  <StyledTableCell>{status}</StyledTableCell>
                  <StyledTableCell>{occurrenceDateTime}</StyledTableCell>
                  <StyledTableCell>{name}</StyledTableCell>
                </StyledTableRow>,
              ],
            ];
          },
          [] as JSX.Element[][],
        ) as JSX.Element[][],
    },
  },
  {
    type: 'row',
    config: {
      label: '',
      render: ({ text }) => {
        const toggleInfo = () => {
          const infoDiv = document.getElementById('composition-generated');

          if (!infoDiv) {
            return null;
          }

          if (infoDiv.style.display === 'none') {
            infoDiv.style.display = 'block';
          } else {
            infoDiv.style.display = 'none';
          }
          return null;
        };

        return (
          <Box
            sx={{
              padding: '20px 0px',
              width: '100%',
              '& table': {
                width: '100%',
                borderCollapse: 'collapse',
                marginBottom: '20px',
                '& th, & td': {
                  border: '1px solid gray',
                  padding: '8px',
                  textAlign: 'left',
                },
              },
            }}
          >
            <StyledButton size="small" variant="contained" onClick={toggleInfo}>
              Toggle Generated
            </StyledButton>
            <div
              dangerouslySetInnerHTML={{ __html: text.div }}
              className="extra-info"
              id="composition-generated"
              style={{ display: 'none' }}
            />
          </Box>
        );
      },
    },
  },
];

export const Composition = (props: Omit<TTabProps<TComposition>, 'rows'>) => (
  <TabSection<TComposition> {...props} rows={rows} />
);
