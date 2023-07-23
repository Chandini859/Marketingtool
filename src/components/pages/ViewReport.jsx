import Box from '@mui/material/Box';
import React from 'react';
import Navbar from '../Navbar';
import Sidenav from '../Sidenav';
import EmailReport from './ViewReport/EmailReport';
export default function ViewReport() {
  return (
    <div>
      <Navbar />
      <Box height={30} />
        <Box sx={{ display: "flex"}}>
      <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, p:3}}>
      <EmailReport />
      </Box>
      </Box>
    </div>
  );
}
