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
import Swal from 'sweetalert2';
import { useAppStore } from '../../appStore';
import AddSubcategory from './AddSubcategory';
import UpdateSubcategory from './UpdateSubcategory';

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
  { id: 'subcategoryName', label: 'Subcategory', minWidth: 100 },
  { id: 'description', label: 'Description', minWidth: 100 },
  { id: 'action', label: 'Action', minWidth: 100 },
];

export default function HomeSubcategory() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [originalRows, setOriginalRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategoryId, setSubcategoryId] = useState(null)
  const setRows = useAppStore((state) => state.setRows);
  const rows = useAppStore((state) => state.rows) || [];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = () => {
    axios
      .get('http://localhost:8080/subcategory')
      .then((res) => {
        setOriginalRows(res.data);
        setRows(res.data);
      })
      .catch(err => console.log(err));
  };

  const handleDelete = (subcategoryId) => {
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
          .delete(`http://localhost:8080/subcategory/${subcategoryId}`)
          .then((res) => {
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            fetchSubcategories(); // Fetch updated data after deletion
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
    setSelectedCategory(v);
    if (!v) {
      setOriginalRows(rows);
    } else {
      const filteredRows = originalRows.filter((row) => row.categoryName === v.categoryName);
      setOriginalRows(filteredRows);
    }
  };

  const handleSubcategorySubmit = () => {
    fetchSubcategories(); // Fetch updated data after submission
    handleClose();
  };

  const editData = (subcategoryId, categoryName, subcategoryName, description) => {
    const data = {
      subcategoryId: subcategoryId,
      categoryName: categoryName,
      subcategoryName: subcategoryName,
      description: description,
    };
    setSelectedCategory(null);
    setSubcategoryId(subcategoryId)
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
            <AddSubcategory closeEvent={handleSubcategorySubmit} />
          </Box>
        </Modal>
        <Modal
          open={editOpen}
          onClose={handleEditClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <UpdateSubcategory subcategoryId={subcategoryId} closeEvent={handleEditClose} />
          </Box>
        </Modal>
      </div>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Typography gutterBottom variant="h5" component="div" sx={{ padding: '20px' }}>
          Subcategories List
        </Typography>
        <Box height={10} />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 2 }}>
          <Autocomplete
            id="combo-box-demo"
            options={originalRows}
            value={selectedCategory}
            sx={{ width: 300 }}
            onChange={(e, v) => filterData(v)}
            getOptionLabel={(row) => row.categoryName || ''}
            renderInput={(params) => <TextField {...params} size="small" label="Search Categories" />}
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
                {columns.map((column) => (
                  <TableCell key={column.id} align="left" style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {originalRows
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.subcategoryId}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{row.categoryMaster ? row.categoryMaster.categoryName : 'Unknown'}</TableCell>
                    <TableCell>{row.subcategoryName}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>
                      <EditIcon
                        style={{
                          fontSize: '20px',
                          color: 'blue',
                          cursor: 'pointer',
                        }}
                        className="cursor-pointer"
                        onClick={() =>
                          editData(row.subcategoryId, row.categoryName, row.subcategoryName, row.description)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <DeleteIcon
                        style={{
                          color: 'red',
                        }}
                        onClick={() => handleDelete(row.subcategoryId)}
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
          count={originalRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
