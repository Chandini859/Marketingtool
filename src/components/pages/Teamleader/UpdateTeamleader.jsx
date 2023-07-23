import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Typography } from '@mui/material';
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAppStore } from "../../appStore";

export default function UpdateTeamleader({ teamId, closeEvent }) {
  const [teamName, setTeamName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [description, setDescription] = useState("");
  const rows = useAppStore((state) => state.rows);
  const setRows = useAppStore((state) => state.setRows);

  useEffect(() => {
    if (teamId) {
      axios
        .get(`http://localhost:8080/team-leaders/${teamId}`)
        .then((res) => {
          const { teamName, email, mobileNumber, creationDate, description } = res.data;
          setTeamName(teamName);
          setEmail(email);
          setMobileNumber(mobileNumber);
          setCreationDate(creationDate);
          setDescription(description);
        })
        .catch((err) => console.log(err));
    }
  }, [teamId]);

  const handleTeamNameChange = (event) => {
    setTeamName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleMobileNumberChange = (event) => {
    setMobileNumber(event.target.value);
  };

  const handleCreationDateChange = (event) => {
    setCreationDate(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const inputData = {
      teamId,
      teamName,
      email,
      mobileNumber,
      creationDate,
      description
    };
    axios
      .put("http://localhost:8080/team-leaders", inputData)
      .then((res) => {
        Swal.fire("Data Updated Successfully!");
        console.log("After Swal ");

        console.log("rows ---> ", rows);
        console.log("teamId ---> ", teamId);
        console.log("teamId ---> ", teamId);

        const updatedRows = rows.map((row) => {
          if (row.teamId === teamId) {
            return {
              ...row,
              teamName,
              email,
              mobileNumber,
              creationDate,
              description
            }
          }
            else{
                return row;
          }
      });
      
      console.log("Rows ---> ", rows);
      console.log("updatedRows ---> ", updatedRows);
         setRows(updatedRows);
        closeEvent();
      


      //   setRows((prevRows) => {
      //     const updatedRows = prevRows.map((row) => {

      //       console.log("teamId -> ",row.teamId);

            
      //       }
      //       return row;
      //     });
      //     return updatedRows;
      //   });
      //   closeEvent();
      })
      .catch((error) => {
        console.error(error);
        // Handle the error appropriately
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
          <TextField id="outlined-basic" label="Name" variant="outlined" size="small" value={teamName} onChange={handleTeamNameChange} sx={{ minWidth: "100%"}}/>
        </Grid>
        <Grid item xs={12}>
          <TextField id="outlined-basic" label="Desigation" variant="outlined" size="small" value={description} onChange={handleDescriptionChange} sx={{ minWidth: "100%"}}/>
        </Grid>
        <Grid item xs={12}>
          <TextField id="outlined-basic" label="Mobile Number" variant="outlined" size="small" value={mobileNumber} onChange={handleMobileNumberChange} sx={{ minWidth: "100%"}}/>
        </Grid>
        <Grid item xs={12}>
          <TextField id="outlined-basic" label="Email" variant="outlined" size="small" value={email} onChange={handleEmailChange} sx={{ minWidth: "100%"}}/>
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
