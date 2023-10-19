import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Autocomplete,
  Box,
  Button,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAppStore } from '../../appStore';
import AddCategory from './AddCategory';
import UpdateCategory from './UpdateCategory';

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
  { id: 'slNo', label: 'Sl.No', minWidth: 100 },
  { id: 'categoryName', label: 'Category Name', minWidth: 100 },
  { id: 'description', label: 'Description', minWidth: 100 },
  { id: 'action', label: 'Action', minWidth: 100 },
];

export default function HomeCategory() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [originalRows, setOriginalRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [inputData, setInputData] = useState({});
  const navigate = useNavigate();
  const setRows = useAppStore((state) => state.setRows);
  const rows = useAppStore((state) => state.rows) || [];// Updated to use local state for rows

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios
      .get(`http://localhost:8080/categories`)
      .then(res => {
        const dataWithSlNo = res.data.map((category, index) => ({
          ...category,
          slNo: index + 1,
        }));
        setOriginalRows(dataWithSlNo);
        setRows(dataWithSlNo);
      })
      .catch(err => console.log(err));
  };

  const handleDelete = categoryId => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then(result => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8080/categories/${categoryId}`)
          .then(res => {
            console.log(res.data);
            fetchCategories();
          })
          .catch(err => console.log(err));
      }
    });
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filterData = v => {
    if (v) {
      const filteredRows = originalRows.filter(row => row.categoryName === v.categoryName);
      setRows(filteredRows);
    } else {
      setRows(originalRows);
    }
  };

  const handleCategorySubmit = () => {
    fetchCategories();
    handleClose();
  };

  const editData = (categoryId, categoryName, description) => {
    const data = {
      categoryId: categoryId,
      categoryName: categoryName,
      description: description,
    };
    setCategoryId(categoryId);
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
            <AddCategory closeEvent={handleCategorySubmit} />
          </Box>
        </Modal>
        <Modal
          open={editOpen}
          onClose={handleEditClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <UpdateCategory
              closeEvent={handleEditClose}
              categoryId={categoryId}
              inputData={inputData}
              setInputData={setInputData}
            />
          </Box>
        </Modal>
      </div>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Typography gutterBottom variant="h5" component="div" sx={{ padding: '20px' }}>
          Categories List
        </Typography>
        <Box height={10} />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 2 }}>
          <Autocomplete
            id="combo-box-demo"
            options={originalRows}
            sx={{ width: 300 }}
            onChange={(e, v) => filterData(v)}
            getOptionLabel={row => row.categoryName || ''}
            renderInput={params => <TextField {...params} size="small" label="Search Category" />}
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
                {columns.map(column => (
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
                  .map(row => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.categoryId}>
                      {columns.map(column => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align="left">
                            {column.format && typeof value === 'number' ? column.format(value) : value}
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
                          onClick={() => editData(row.categoryId, row.categoryName, row.description)}
                        />
                        <DeleteIcon
                          style={{
                            color: 'red',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleDelete(row.categoryId)}
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
