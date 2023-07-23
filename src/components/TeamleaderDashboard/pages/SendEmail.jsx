import Box from '@mui/material/Box';
import React from 'react';
import TeamleadNavbar from '../TeamleadNavbar';
import TeamleadSidenav from '../TeamleadSidenav';
import SendingEmail from './SendEmail/SendingEmail';

export default function SendEmail() {
  return (
    <div>
      <TeamleadNavbar />
      <Box height={30} />
        <Box sx={{ display: "flex"}}>
      <TeamleadSidenav />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <SendingEmail />
      </Box>
      </Box>
    </div>
  );
}
