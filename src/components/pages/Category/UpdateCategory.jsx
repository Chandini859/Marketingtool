import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Typography } from '@mui/material';
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAppStore } from "../../appStore";

export default function UpdateCategory({ categoryId, closeEvent }) {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const rows = useAppStore((state) => state.rows);
  const setRows = useAppStore((state) => state.setRows);

  useEffect(() => {
    if (categoryId) {
      axios
        .get(`http://localhost:8080/categories/${categoryId}`)
        .then((res) => {
          const { categoryName, description } = res.data;
          setCategoryName(categoryName);
          setDescription(description);
        })
        .catch((err) => console.log(err));
    }
  }, [categoryId]);

  const handleCategoryNameChange = (event) => {
    setCategoryName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const inputData = {
      categoryId,
      categoryName,
      description
    };
    axios
      .put("http://localhost:8080/categories", inputData)
      .then((res) => {
        Swal.fire("Data Updated Successfully!");
        const updatedRows = rows.map((row) => {
          if (row.categoryId === categoryId) {
            return {
              ...row,
              categoryName,
              description
            };
          }
          return row;
        });
        setRows(updatedRows);
        closeEvent();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Box sx={{ m: 2}}/>
      <Typography variant="h5" align="center">
        Update Teamleader
      </Typography>
      <IconButton
        style={{ position: "absolute", top: "0", right: "0"}}
        onClick={closeEvent}
      >
        <CloseIcon />
      </IconButton>
      <Box height={20} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField id="outlined-basic" label="Category Name" variant="outlined" size="small" value={categoryName} onChange={handleCategoryNameChange} sx={{ minWidth: "100%"}}/>
        </Grid>
        <Grid item xs={12}>
          <TextField id="outlined-basic" label="Description" variant="outlined" size="small" value={description} onChange={handleDescriptionChange} sx={{ minWidth: "100%"}}/>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" align="center">
            <Button variant="contained" onClick={handleSubmit}>
              Update
            </Button>
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ m: 4}}/>
    </>
  );
}
