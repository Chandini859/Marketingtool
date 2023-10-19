import {
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const columns = [
  { id: 'SlNo', label: 'SlNo', minWidth: 170 },
  { id: 'subject', label: 'Title', minWidth: 100 },
  { id: 'sentDate', label: 'Date', minWidth: 100 },
  { id: 'No.of Participants', label: 'No. of Participants', minWidth: 100 },
];

export default function TeamLeaderEmailReport() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/Email/reports/5`)
      .then(res => {
        setData(res.data);
        console.log("result ", res.data);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography gutterBottom variant="h5" component="div" sx={{ padding: '20px' }}>
        Email Report
      </Typography>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} align="left" style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                <TableCell align="left">{index + 1}</TableCell>
                {columns.slice(1).map(column => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align="left">
                      {column.format && typeof value === 'number' ? column.format(value) : value}
                    </TableCell>
                  );
                })}
                <TableCell align="left">
                  {row.emailStatusesSet && (
                    <Link href={`/participants/${row.id}`} underline="hover">
                      {row.emailStatusesSet.length}
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
