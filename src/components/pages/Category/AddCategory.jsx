import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Grid, IconButton, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useAppStore } from '../../appStore';

export default function AddCategory({ closeEvent }) {
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');

  const setRows = useAppStore((state) => state.setRows);

  const handleCategoryNameChange = (event) => {
    setCategoryName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const createUser = () => {
    const inputData = {
      categoryName,
      description,
    };

    axios
      .post('http://localhost:8080/categories', inputData)
      .then((res) => {
        closeEvent();
        Swal.fire('Submitted!', 'Your file has been submitted.', 'success');
        setRows((prevRows) => {
          // Ensure that rows is initialized as an array
          const rows = Array.isArray(prevRows) ? prevRows : [];
          return [...rows, res.data];
        });
      })
      .catch((error) => {
        console.error(error);
        Swal.fire('Error!', 'Failed to submit the details.', 'error');
      });
  };

  return (
    <>
      <Box sx={{ m: 2 }} />
      <Typography variant="h5" align="center">
        Add Category
      </Typography>
      <IconButton style={{ position: 'absolute', top: '0', right: '0' }} onClick={closeEvent}>
        <CloseIcon />
      </IconButton>
      <Box height={20} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            id="category-name"
            label="Category Name"
            variant="outlined"
            size="small"
            value={categoryName}
            onChange={handleCategoryNameChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="description"
            label="Description"
            variant="outlined"
            size="small"
            value={description}
            onChange={handleDescriptionChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" align="center">
            <Button variant="contained" onClick={createUser}>
              Submit
            </Button>
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ m: 4 }} />
    </>
  );
}
