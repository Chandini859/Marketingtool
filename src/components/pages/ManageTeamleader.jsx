import Box from '@mui/material/Box';
import React from 'react';
import Navbar from '../Navbar';
import Sidenav from '../Sidenav';
import HomeTeamleader from './Teamleader/HomeTeamleader';
export default function ManageTeamleader() {
  return (
    <div>
      <Navbar />
      <Box height={70} />
        <Box sx={{ display: "flex"}}>
      <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, p:3}}>
        <HomeTeamleader />
      </Box>
      </Box>
    </div>
  );
}
