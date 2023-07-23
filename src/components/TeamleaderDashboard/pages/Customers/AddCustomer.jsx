import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { useAppStore } from "../../../appStore";

export default function AddCustomer({ closeEvent }) {
  const [customerName, setCustomerName] = useState("");
  const [organization, setOrganization] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [subcategory, setSubcategory] = useState("");
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

  const handleSubcategoryChange = (event) => {
    setSubcategory(event.target.value);
  };

  const createUser = () => {
    const inputData = {
      customerName,
      organization,
      mobileNumber,
      phoneNumber,
      address,
      categoryId: "2", // Replace with the desired categoryId
      subcategoryId: "1", // Replace with the desired subcategoryId
      categoryMaster: {
        categoryId: "2", // Replace with the desired categoryId
      },
      subcategory: {
        subcategoryId: "1", // Replace with the desired subcategoryId
      },
    };

    axios
      .post("http://localhost:8080/customers", inputData)
      .then((res) => {
        closeEvent();
        Swal.fire("Submitted!", "Your file has been submitted.", "success");
        setRows((prevRows) => {
          const rows = Array.isArray(prevRows) ? prevRows : [];
          return [...rows, res.data];
        });
      })
      .catch((error) => {
        console.error(error);
        Swal.fire("Error!", "Failed to submit the details.", "error");
      });
  };

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
            label="Name"
            variant="outlined"
            size="small"
            value={customerName}
            onChange={handleCustomerNameChange}
            sx={{ minWidth: "100%" }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="phoneNumber"
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
            label="Email"
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
            id="subcategory"
            label="Subcategory"
            variant="outlined"
            size="small"
            value={subcategory}
            onChange={handleSubcategoryChange}
            sx={{ minWidth: "100%" }}
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
