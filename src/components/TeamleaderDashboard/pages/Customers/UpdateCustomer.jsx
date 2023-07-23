import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Typography } from '@mui/material';
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAppStore } from "../../../appStore";

export default function UpdateCustomer({ customerId, closeEvent }) {
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [action, setAction] = useState("");
  const rows = useAppStore((state) => state.rows);
  const setRows = useAppStore((state) => state.setRows);

  useEffect(() => {
    if (customerId) {
      axios
        .get(`http://localhost:8080/customers/${customerId}`)
        .then((res) => {
          const { customerName, mobileNumber, phoneNumber, address, subcategory, action } = res.data;
          setCustomerName(customerName);
          setMobileNumber(mobileNumber);
          setPhoneNumber(phoneNumber);
          setAddress(address);
          setSubcategory(subcategory && subcategory.subcategoryName); // Get the subcategoryName property
          setAction(action);
        })
        .catch((err) => console.log(err));
    }
  }, [customerId]);

  const handleCustomerNameChange = (event) => {
    setCustomerName(event.target.value);
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const inputData = {
      customerId,
      customerName,
      mobileNumber,
      phoneNumber,
      address,
      subcategory
    };
    axios
      .put("http://localhost:8080/customers", inputData)
      .then((res) => {
        Swal.fire("Data Updated Successfully!");
        const updatedRows = rows.map((row) => {
          if (row.customerId === customerId) {
            return {
              ...row,
              customerName,
              mobileNumber,
              phoneNumber,
              address,
              subcategory,
              action
            };
          }
          return row;
        });
        setRows(updatedRows);
        closeEvent();
      })
      .catch((error) => {
        console.error(error);
        Swal.fire('Error!', 'Failed to update the details.', 'error');
      });
  };

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
        <Grid item xs={12}>
          <TextField id="outlined-basic" label="Customer Name" variant="outlined" size="small" value={customerName} onChange={handleCustomerNameChange} sx={{ minWidth: "100%" }} />
        </Grid>
        <Grid item xs={12}>
          <TextField id="outlined-basic" label="Mobile Number" variant="outlined" size="small" value={mobileNumber} onChange={handleMobileNumberChange} sx={{ minWidth: "100%" }} />
        </Grid>
        <Grid item xs={12}>
          <TextField id="outlined-basic" label="Phone Number" variant="outlined" size="small" value={phoneNumber} onChange={handlePhoneNumberChange} sx={{ minWidth: "100%" }} />
        </Grid>
        <Grid item xs={12}>
          <TextField id="outlined-basic" label="Address" variant="outlined" size="small" value={address} onChange={handleAddressChange} sx={{ minWidth: "100%" }} />
        </Grid>
        <Grid item xs={12}>
          <TextField id="outlined-basic" label="Subcategory" variant="outlined" size="small" value={subcategory} onChange={handleSubcategoryChange} sx={{ minWidth: "100%" }} />
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
