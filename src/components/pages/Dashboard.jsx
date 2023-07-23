import Box from '@mui/material/Box';
import React from 'react';
import Navbar from '../Navbar';
import Sidenav from '../Sidenav';

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <Box height={30} />
        <Box sx={{ display: "flex"}}>
      <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <h1>Dashboard - Admin</h1>
      </Box>
      </Box>
    </div>
  );
}
