import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, MenuItem, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function AddCustomer({ closeEvent }) {
  const [customerName, setCustomerName] = useState("");
  const [organization, setOrganization] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [formData, setFormData] = useState({
    categoryId: "", 
    subcategoryId: "", 
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const handleCustomerNameChange = (event) => {
    setCustomerName(event.target.value);
  };

  const handleOrganizationChange = (event) => {
    setOrganization(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleMobileNumberChange = (event) => {
    setMobileNumber(event.target.value);
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleCategoryChange = (event) => {
    const { value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      categoryId: value,
      subcategoryId: '', // Reset subcategoryId when a new category is selected
    }));

    // Fetch subcategories based on the selected category
    axios
      .get(`http://localhost:8080/subcategory`)
      .then((res) => {
        setSubcategories(res.data);
        // setSubCategoryCustomers([]); // If these were declared as states, you can reset them here
        // setSelectedCustomers([]); // If these were declared as states, you can reset them here
      })
      .catch((error) => {
        console.error(error);
        setSubcategories([]);
        // setSubCategoryCustomers([]); // If these were declared as states, you can reset them here
        // setSelectedCustomers([]); // If these were declared as states, you can reset them here
      });
  };

  const handleSubcategoryChange = (event) => {
    const { value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      subcategoryId: value, // Update subcategoryId in formData
    }));
  };

  const createUser = () => {
    const inputData = {
      customerName,
      organization,
      mobileNumber,
      phoneNumber,
      address,
      categoryId: formData.categoryId, // Use the selected categoryId from formData
      subcategoryId: formData.subcategoryId, // Use the selected subcategoryId from formData
      categoryMaster: {
        categoryId: formData.categoryId, // Use the selected categoryId from formData
      },
      subcategory: {
        subcategoryId: formData.subcategoryId, // Use the selected subcategoryId from formData
      },
    };

    axios
      .post("http://localhost:8080/customers", inputData)
      .then((res) => {
        closeEvent();
        Swal.fire("Submitted!", "Your file has been submitted.", "success");
        // setRows((prevRows) => {
        //   const rows = Array.isArray(prevRows) ? prevRows : [];
        //   return [...rows, res.data];
        // });
      })
      .catch((error) => {
        console.error(error);
        Swal.fire("Error!", "Failed to submit the details.", "error");
      });
  };

  useEffect(() => {
    // Fetch categories on component mount
    axios
      .get("http://localhost:8080/categories")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <Box sx={{ m: 2 }} />
      <Typography variant="h5" align="center">
        Add Customer
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
            id="customerName"
            label="Customer Name"
            variant="outlined"
            size="small"
            value={customerName}
            onChange={handleCustomerNameChange}
            sx={{ minWidth: "100%" }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="organization"
            label="Organization"
            variant="outlined"
            size="small"
            value={organization}
            onChange={handleOrganizationChange}
            sx={{ minWidth: "100%" }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="address"
            label="Address"
            variant="outlined"
            size="small"
            value={address}
            onChange={handleAddressChange}
            sx={{ minWidth: "100%" }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="phoneNumber"
            label="Phone Number"
            variant="outlined"
            size="small"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            sx={{ minWidth: "100%" }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="mobileNumber"
            label="Mobile Number"
            variant="outlined"
            size="small"
            value={mobileNumber}
            onChange={handleMobileNumberChange}
            sx={{ minWidth: "100%" }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="categoryId"
            label="Category Name"
            variant="outlined"
            size="small"
            value={formData.categoryId}
            onChange={handleCategoryChange}
            sx={{ mb: 1, fontSize: "1rem" }}
            fullWidth
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
            id="subcategoryId"
            label="Subcategory Name"
            variant="outlined"
            size="small"
            value={formData.subcategoryId}
            onChange={handleSubcategoryChange}
            sx={{ mb: 1, fontSize: "1rem" }}
            fullWidth
            select
          >
            {subcategories.map((subcategory) => (
              <MenuItem
                key={subcategory.subcategoryId}
                value={subcategory.subcategoryId}
              >
                {subcategory.subcategoryName}
              </MenuItem>
            ))}
          </TextField>
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
