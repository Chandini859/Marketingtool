import Box from '@mui/material/Box';
import React from 'react';
import Navbar from '../Navbar';
import Sidenav from '../Sidenav';
import HomeCategory from "./Category/HomeCategory";
export default function ManageCategory() {
  return (
    <div>
      <Navbar />
      <Box height={30} />
        <Box sx={{ display: "flex"}}>
      <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, p:3}}>
      <HomeCategory />
      </Box>
      </Box>
    </div>
  );
}
