import {
  Backdrop,
  Fade,
  Link,
  Modal,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import React, { useEffect, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import DataTable from 'react-data-table-component';
import { MdCloudDownload } from 'react-icons/md';

const columns = [
  { id: 'SlNo', label: 'SlNo', minWidth: 170 },
  { id: 'subject', label: 'Title', minWidth: 100 },
  { id: 'sentDate', label: 'Date', minWidth: 100 },
  { id: 'No.of Participants', label: 'No. of Participants', minWidth: 100 },
];

export default function EmailReport() {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get('http://localhost:8080/Email/reports')
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleOpenModal = async (rowData) => {
    setModalData(rowData);
    setModalOpen(true);

    try {
      const response = await axios.get(`http://localhost:8080/fileuploads/EmailMasterId/${rowData.emailId}`);
      setFileData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const generatePdfForModal = () => {
    const doc = new jsPDF();

    doc.text('Modal Content PDF Report', 10, 10);

    const pdfData = [
      {
        slNo: 1,
        subject: modalData.subject,
        categoryName: modalData.subcategory?.categoryMaster?.categoryName || 'N/A',
        subcategoryName: modalData.subcategory?.subcategoryName || 'N/A',
      },
    ];

    doc.autoTable({
      head: [['Sl.No', 'Subject', 'Category Name', 'Subcategory Name']],
      body: pdfData.map((row) => [row.slNo, row.subject, row.categoryName, row.subcategoryName]),
    });

    doc.save('modal_content_report.pdf');
  };

  const fetchAndOpenFile = async (fileId, emailMasterId, fileName) => {
    try {
      const response = await axios.get(`http://localhost:8080/fileuploads/file-path/${emailMasterId}/${fileId}`, {
        responseType: 'blob',
      });

      const fileBlob = new Blob([response.data], { type: response.headers['content-type'] });

      const fileURL = URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = fileName; 
      link.click();
    } catch (error) {
      console.log(error);
    }
  };

  const ref = useRef();

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography gutterBottom variant="h5" component="div" sx={{ padding: '20px', textAlign: 'center' }}>
        Email Report
      </Typography>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align="left" style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(data) &&
              data.slice(startIndex, endIndex).map((row, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell align="left">{startIndex + index + 1}</TableCell>
                  {columns.slice(1).map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align="left">
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                  <TableCell align="left">
                    <Link href="#" underline="hover" onClick={() => handleOpenModal(row)}>
                      {row.emailStatusesSet.length}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(data.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
      />

      {modalData && (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '1000',
            margin: '0 auto',
          }}
        >
          <Fade in={modalOpen}>
            <div
              ref={ref}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '5px',
              }}
            >
              <h2>Modal Content</h2>
              <p>Email Status: {modalData.emailStatusesSet.length}</p>
              <p>Subject: {modalData.subject}</p>
              <p>Sent Date: {modalData.sentDate}</p>

              <DataTable
                title="Modal Table"
                columns={[
                  { name: 'Sl.No', selector: 'slNo', sortable: true },
                  { name: 'Subject', selector: 'subject', sortable: true },
                  { name: 'Category Name', selector: 'categoryName', sortable: true },
                  { name: 'Subcategory Name', selector: 'subcategoryName', sortable: true },
                  {
                    name: 'File',
                    cell: (row) => (
                      <div>
                        {fileData && fileData.length > 0 ? (
                          fileData.map((file) => (
                            <div key={file.id}>
                              <a href="#" onClick={() => fetchAndOpenFile(file.fileId, modalData.emailId, file.fileName)}>
                                {file.fileName}
                              </a>
                            </div>
                          ))
                        ) : (
                          'No File Available'
                        )}
                      </div>
                    ),
                  },
                ]}
                data={[
                  {
                    slNo: startIndex + 1,
                    subject: modalData.subject,
                    categoryName: modalData.subcategory?.categoryMaster?.categoryName || 'N/A',
                    subcategoryName: modalData.subcategory?.subcategoryName || 'N/A',
                  },
                ]}
                actions={
                  <div>
                    <CSVLink
                      data={[
                        {
                          slNo: startIndex + 1,
                          subject: modalData.subject,
                          categoryName: modalData.subcategory?.categoryMaster?.categoryName || 'N/A',
                          subcategoryName: modalData.subcategory?.subcategoryName || 'N/A',
                        },
                      ]}
                      filename="modal_table_data.csv"
                    >
                      <MdCloudDownload />
                    </CSVLink>
                    <button onClick={() => {}}>
                      <MdCloudDownload /> Excel
                    </button>
                    <button onClick={generatePdfForModal}>
                      <MdCloudDownload /> PDF
                    </button>
                  </div>
                }
              />

              <div>
                <button onClick={() => setModalOpen(false)}>Close Modal</button>
              </div>
            </div>
          </Fade>
        </Modal>
      )}
    </Paper>
  );
}
