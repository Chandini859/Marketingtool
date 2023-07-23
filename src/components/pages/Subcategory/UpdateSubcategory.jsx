import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, MenuItem, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAppStore } from "../../appStore";

export default function UpdateSubcategory({ subcategoryId, closeEvent }) {
  const [subcategoryName, setSubcategoryName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [initialData, setInitialData] = useState({}); 
  const setRows = useAppStore((state) => state.setRows);
  const rows = useAppStore((state) => state.rows);

  useEffect(() => {
    if (subcategoryId) {
      axios
        .get(`http://localhost:8080/subcategory/${subcategoryId}`)
        .then((res) => {
          const { subcategoryName, categoryMaster, description } = res.data;
          setInitialData({
            subcategoryName,
            categoryId: categoryMaster.categoryId,
            description,
          });
        })
        .catch((error) => console.log(error));
    }
  }, [subcategoryId]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/categories")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    setSubcategoryName(initialData.subcategoryName || "");
    setCategoryId(initialData.categoryId || "");
    setDescription(initialData.description || "");
  }, [initialData]);

  const handleSubcategoryNameChange = (event) => {
    setSubcategoryName(event.target.value);
  };

  const handleCategoryIdChange = (event) => {
    setCategoryId(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const inputData = {
      subcategoryId,
      subcategoryName,
      categoryMaster: {
        categoryId,
      },
      description,
    };
    axios
      .put("http://localhost:8080/subcategory", inputData)
      .then((res) => {
        Swal.fire("Data Updated Successfully!");
        const updatedRows = rows.map((row) => {
          if (row.subcategoryId === subcategoryId) {
            return {
              ...row,
              subcategoryName,
              categoryId,
              description,
            };
          }
          return row;
        });
        setRows(updatedRows);
        closeEvent();
      })
      .catch((error) => {
        console.error(error);
        // Handle the error appropriately
      });
  };

  return (
    <>
      <Box sx={{ m: 2 }} />
      <Typography variant="h5" align="center">
        Update Subcategory
      </Typography>
      <IconButton
        style={{ position: "absolute", top: "0", right: "0" }}
        onClick={closeEvent}
      >
        <CloseIcon />
      </IconButton>
      <Box height={20} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            id="subcategoryName"
            label="Subcategory Name"
            variant="outlined"
            size="small"
            value={subcategoryName}
            onChange={handleSubcategoryNameChange}
            sx={{ minWidth: "100%" }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="categoryId"
            label="Category Name"
            variant="outlined"
            size="small"
            value={categoryId || ""}
            onChange={handleCategoryIdChange}
            sx={{ minWidth: "100%" }}
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
            id="description"
            label="Description"
            variant="outlined"
            size="small"
            value={description}
            onChange={handleDescriptionChange}
            sx={{ minWidth: "100%" }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" align="center">
            <Button variant="contained" onClick={handleSubmit}>
              Update
            </Button>
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ m: 4 }} />
    </>
  );
}
