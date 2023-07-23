import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { useAppStore } from "../../appStore";

export default function AddTeamleader({ closeEvent }) {
  const [teamName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [description, setDescription] = useState("");
  const setrows = useAppStore((state) => state.setRows);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleMobileNumberChange = (event) => {
    setMobileNumber(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const createUser = () => {
    const inputData = {
      teamName,
      email,
      mobileNumber,
      description,
    };

    axios
      .post("http://localhost:8080/team-leaders", inputData)
      .then((res) => {
        closeEvent();
        Swal.fire("Submitted!", "Your file has been submitted.", "success");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Box sx={{ m: 2 }} />
      <Typography variant="h5" align="center">
        Add Team Leader
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
            id="outlined-basic"
            label="Name"
            variant="outlined"
            size="small"
            value={teamName}
            onChange={handleNameChange}
            sx={{ minWidth: "100%" }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="outlined-basic"
            label="Designation"
            variant="outlined"
            size="small"
            value={description}
            onChange={handleDescriptionChange}
            sx={{ minWidth: "100%" }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="outlined-basic"
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
            id="outlined-basic"
            label="Email"
            variant="outlined"
            size="small"
            value={email}
            onChange={handleEmailChange}
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
