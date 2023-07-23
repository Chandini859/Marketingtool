import Box from '@mui/material/Box';
import React from 'react';
import TeamleadNavbar from '../TeamleadNavbar';
import TeamleadSidenav from '../TeamleadSidenav';

export default function Home() {
  return (
    <div>
      <TeamleadNavbar />
      <Box height={30} />
        <Box sx={{ display: "flex"}}>
      <TeamleadSidenav />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <h1>Dashboard - Team Leader</h1>
      </Box>
      </Box>
    </div>
  );
}
