import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, MenuItem, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAppStore } from "../../../appStore";

export default function UpdateCustomer({ customerId, closeEvent }) {
  const [customerName, setCustomerName] = useState("");
  const [organization, setOrganization] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const rows = useAppStore((state) => state.rows);
  const setRows = useAppStore((state) => state.setRows);

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
    setCategoryId(value);
  };

  const handleSubmit = () => {
    const inputData = {
      customerId,
      customerName,
      organization,
      mobileNumber,
      phoneNumber,
      address,
      categoryId,
      categoryMaster: {
        categoryId,
      },
    };

    axios
      .put("http://localhost:8080/customers", inputData)
      .then((res) => {
        Swal.fire("Updated!", "Your data has been updated.", "success");
        const updatedRows = rows.map((row) => {
          if (row.customerId === customerId) {
            return {
              ...row,
              customerName,
              organization,
              mobileNumber,
              phoneNumber,
              address,
              categoryId,
              subcategory: null,
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

  useEffect(() => {
    if (customerId) {
      axios
        .get(`http://localhost:8080/customers/${customerId}`)
        .then((res) => {
          const {
            customerName,
            organization,
            mobileNumber,
            phoneNumber,
            address,
            categoryId,
          } = res.data;
          setCustomerName(customerName);
          setOrganization(organization);
          setMobileNumber(mobileNumber);
          setPhoneNumber(phoneNumber);
          setAddress(address);
          setCategoryId(categoryId);
        })
        .catch((err) => console.log(err));
    }
  }, [customerId]);

  const [categories, setCategories] = useState([]);

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

  return (
    <>
      <Box sx={{ m: 2 }} />
      <Typography variant="h5" align="center">
        Update Customer
      </Typography>
      <IconButton
        style={{ position: "absolute", top: "0", right: "0" }}
        onClick={closeEvent}
      >
        <CloseIcon />
      </IconButton>
      <Box height={20} />
      <Grid container spacing={2}>
        {/* ... Other Grid items ... */}
        <Grid item xs={12}>
          <TextField
            id="categoryId"
            label="Category Name"
            variant="outlined"
            size="small"
            value={categoryId}
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
