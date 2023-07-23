import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Autocomplete, Box, Button, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAppStore } from '../../../appStore';
import AddCustomer from './AddCustomer';
import UpdateCustomer from './UpdateCustomer';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const columns = [
  { id: 'customerName', label: 'Name', minWidth: 100 },
  { id: 'organization', label: 'Organization', minWidth: 100 },
  { id: 'mobileNumber', label: 'Mobile Number', minWidth: 100 },
  { id: 'phoneNumber', label: 'Phone Number', minWidth: 100 },
  { id: 'address', label: 'Email', minWidth: 100 },
  { id: 'subcategory', label: 'Subcategory', minWidth: 100 },
  { id: 'action', label: 'Action', minWidth: 100 },
];

export default function HomeCustomer() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [originalRows, setOriginalRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [inputData, setInputData] = useState({});
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);
  const [serialNumber, setSerialNumber] = useState(1); // Start from 1
  const navigate = useNavigate();
  const setRows = useAppStore((state) => state.setRows);
  const rows = useAppStore((state) => state.rows) || [];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    axios
      .get('http://localhost:8080/customers')
      .then((res) => {
        // Use the response data to set serial numbers
        const updatedRows = res.data.map((row, index) => ({
          ...row,
          serialNumber: index + 1, // Incremental serial number starting from 1
        }));
        setOriginalRows(updatedRows);
        setRows(updatedRows);
        setAutocompleteOptions(updatedRows.map((row) => row.customerName));
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (customerId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8080/customers/${customerId}`)
          .then((res) => {
            console.log(res.data);
            fetchCustomers(); // Fetch updated data after deletion
          })
          .catch((err) => console.log(err));
      }
    });
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filterData = (v) => {
    if (v) {
      const filteredRows = originalRows.filter((row) => row.customerName === v);
      setRows(filteredRows);
    } else {
      setRows(originalRows);
    }
  };

  const handleCustomerSubmit = () => {
    fetchCustomers(); // Fetch updated data after submission
    handleClose();
  };

  const editData = (customerId, customerName, mobileNumber, phoneNumber, address, subcategory, action) => {
    const data = {
      customerId: customerId,
      customerName: customerName,
      mobileNumber: mobileNumber,
      phoneNumber: phoneNumber,
      address: address,
      subcategory: subcategory, // Keep the whole 'subcategory' object
      action: action,
    };
    setCustomerId(customerId);
    setInputData(data);
    handleEditOpen();
  };

  return (
    <>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <AddCustomer closeEvent={handleCustomerSubmit} />
          </Box>
        </Modal>
        <Modal
          open={editOpen}
          onClose={handleEditClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <UpdateCustomer closeEvent={handleEditClose} customerId={customerId} inputData={inputData} setInputData={setInputData} />
          </Box>
        </Modal>
      </div>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Typography gutterBottom variant="h5" component="div" sx={{ padding: '20px' }}>
          Customers List
        </Typography>
        <Box height={10} />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 2 }}>
          <Autocomplete
            id="combo-box-demo"
            options={autocompleteOptions}
            sx={{ width: 300 }}
            onChange={(e, v) => filterData(v)}
            renderInput={(params) => <TextField {...params} size="small" label="Search Customers" />}
          />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
          <Button variant="contained" endIcon={<AddCircleIcon />} onClick={handleOpen}>
            Add
          </Button>
        </Box>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="left" style={{ minWidth: 100 }}>
                  Sl.No.
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={column.id} align="left" style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(rows) &&
                rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.customerId}>
                      <TableCell align="left">{row.serialNumber}</TableCell>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align="left">
                            {column.id === 'subcategory' && row.subcategory
                              ? row.subcategory.subcategoryName
                              : value}
                          </TableCell>
                        );
                      })}
                      <TableCell align="left">
                        <EditIcon
                          style={{
                            fontSize: '20px',
                            color: 'blue',
                            cursor: 'pointer',
                          }}
                          className="cursor-pointer"
                          onClick={() =>
                            editData(
                              row.customerId,
                              row.customerName,
                              row.mobileNumber,
                              row.phoneNumber,
                              row.address,
                              row.subcategory,
                              row.action
                            )
                          }
                        />
                      </TableCell>
                      <TableCell align="left">
                        <DeleteIcon
                          style={{
                            color: 'red',
                          }}
                          onClick={() => handleDelete(row.customerId)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={Array.isArray(rows) ? rows.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
