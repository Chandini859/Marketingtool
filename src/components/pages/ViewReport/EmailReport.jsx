import {
  Backdrop,
  Fade,
  Link,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { StyleSheet } from '@react-pdf/renderer';
import axios from 'axios';
import jsPDF from 'jspdf';
import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';

const columns = [
  { id: 'SlNo', label: 'SlNo', minWidth: 170 },
  { id: 'subject', label: 'Title', minWidth: 100 },
  { id: 'sentDate', label: 'Date', minWidth: 100 },
  { id: 'No.of Participants', label: 'No. of Participants', minWidth: 100 },
];

const styles = StyleSheet.create({
  // ... (existing styles)
  modalTable: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  modalTableRow: {
    flexDirection: 'row',
  },
  modalTableHeaderCell: {
    backgroundColor: '#f0f0f0',
    padding: 5,
    fontWeight: 'bold',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modalTableCell: {
    padding: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default function EmailReport() {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalDataCount, setModalDataCount] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8080/Email')
      .then(res => {
        setData(res.data);
        console.log("result ", res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const handleOpenModal = (event, rowData) => {
    event.preventDefault(); // Prevent default link navigation behavior
    setModalData(rowData);
    setModalDataCount(rowData.emailStatusesSet);
    setModalOpen(true);
  };

  const pdfGenerate = () => {
    var doc = new jsPDF('landscape', 'px', 'a4', false);

    // Add content to the PDF
    doc.setFontSize(12);
    doc.text('Email Statuses Count Data', 20, 20);

    // Loop through modalDataCount and add its content to the PDF
    let yOffset = 40; // Initial y-offset for content
    modalDataCount.forEach((status, index) => {
      doc.text(status.id, 20, yOffset);
      doc.text(status.customerMaster.customerName, 120, yOffset);
      doc.text(status.customerMaster.organization, 220, yOffset);
      yOffset += 20; // Increase y-offset for the next row
    });

    // Save the PDF
    doc.save('report.pdf');
  };

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
                  <Link href="#" underline="hover" onClick={(event) => handleOpenModal(event, row)}>
                    {row.emailStatusesSet.length}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Fade in={modalOpen}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '5px', minWidth: '80%', maxWidth: '90%' }}>
            {modalDataCount.length > 0 && (
              <div>
                <h2>Email Statuses Count Data</h2>
                <div style={styles.modalTable}>
                  <div style={styles.modalTableRow}>
                    <div style={styles.modalTableHeaderCell}>Email Status ID</div>
                    <div style={styles.modalTableHeaderCell}>Customer Name</div>
                    <div style={styles.modalTableHeaderCell}>Organization</div>
                    {/* Add more headers as needed */}
                  </div>
                  {modalDataCount.map(status => (
                    <div key={status.id} style={styles.modalTableRow}>
                      <div style={styles.modalTableCell}>{status.id}</div>
                      <div style={styles.modalTableCell}>{status.customerMaster.customerName}</div>
                      <div style={styles.modalTableCell}>{status.customerMaster.organization}</div>
                      {/* Add more cells as needed */}
                    </div>
                  ))}
                </div>
                {/* Add download options */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                  <Button onClick={pdfGenerate}>Download PDF</Button>
                </div>
              </div>
            )}
          </div>
        </Fade>
      </Modal>
    </Paper>
  );
}
