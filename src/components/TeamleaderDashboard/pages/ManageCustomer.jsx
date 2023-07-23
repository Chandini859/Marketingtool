import Box from '@mui/material/Box';
import React from 'react';
import TeamleadNavbar from '../TeamleadNavbar';
import TeamleadSidenav from '../TeamleadSidenav';
import HomeCustomer from './Customers/HomeCustomer';

export default function ManageCustomer() {
  return (
    <div>
      <TeamleadNavbar />
      <Box height={30} />
        <Box sx={{ display: "flex"}}>
      <TeamleadSidenav />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <HomeCustomer />
      </Box>
      </Box>
    </div>
  );
}
