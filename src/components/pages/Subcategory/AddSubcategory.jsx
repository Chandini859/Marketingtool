import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Grid, IconButton, MenuItem, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import { useAppStore } from '../../appStore';

export default function AddSubcategory({ closeEvent }) {
  const [subcategoryName, setSubcategoryName] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const setRows = useAppStore((state) => state.setRows);

  useEffect(() => {
    axios
      .get('http://localhost:8080/categories')
      .then((res) => {
        setCategories(res.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get('http://localhost:8080/subcategory')
      .then((res) => {
        setSubcategories(res.data);
      })
      .catch((error) => {
        console.error(error);
        setSubcategories([]);
      });
  }, []);

  const handleSubcategoryNameChange = (event) => {
    setSubcategoryName(event.target.value);
  };

  const handleCategoryIdChange = (event) => {
    setCategoryId(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = () => {
    const inputData = {
      subcategoryName,
      categoryMaster: { categoryId },
      description,
    };

    axios
      .post('http://localhost:8080/subcategory', inputData)
      .then((res) => {
        closeEvent();
        Swal.fire('Submitted!', 'Your file has been submitted.', 'success');
        setRows((prevRows) => {
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
        Add Subcategory
      </Typography>
      <IconButton style={{ position: 'absolute', top: 0, right: 0 }} onClick={closeEvent}>
        <CloseIcon />
      </IconButton>
      <Box height={20} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            id="categoryId"
            label="Category Name"
            variant="outlined"
            size="small"
            value={categoryId || ''}
            onChange={handleCategoryIdChange}
            sx={{ minWidth: '100%' }}
            select
          >
            {categories.map((category) => (
              <MenuItem key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="subcategoryName"
            label="Subcategory Name"
            variant="outlined"
            size="small"
            value={subcategoryName}
            onChange={handleSubcategoryNameChange}
            sx={{ mb: 1, fontSize: '1rem' }}
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
            sx={{ minWidth: '100%' }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" align="center">
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ m: 4 }} />
    </>
  );
}
