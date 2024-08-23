import { ArrayCaption } from "@/app/components/typography/ArrayCaption";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

export default function ConnectionDetails({ patientInfo }) {
  const addressRows = patientInfo.address.map((addressInfo) => {
    return {
      use: addressInfo.use,
      city: addressInfo.city,
      state: addressInfo.state,
      postalCode: addressInfo.postalCode,
      country: addressInfo.country,
      line: addressInfo.line.map((lineInfo) => lineInfo),
    };
  });

  const phoneRows = patientInfo.telecom.map((telecomInfo) => {
    return {
      use: telecomInfo.use,
      system: telecomInfo.system,
      value: telecomInfo.value,
    };
  });

  return (
    <>
      <ArrayCaption caption="Connection Details" />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell align="right">Info</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {addressRows.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.use} Address</TableCell>
                <TableCell align="right">{`${row.line},${row.city}, ${row.postalCode}, ${row.country}`}</TableCell>
              </TableRow>
            ))}

            {phoneRows.map((row) => (
              <TableRow key={row.value}>
                <TableCell>
                  {row.use} {row.system}
                </TableCell>
                <TableCell align="right">{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
