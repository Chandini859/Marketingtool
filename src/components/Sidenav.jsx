import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { CssBaseline, Divider, IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled, useTheme } from '@mui/material/styles';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from './appStore';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function Sidenav() {
  const theme = useTheme();
  const navigate = useNavigate();
  const open = useAppStore((state) => state.dopen);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Box height={30} />
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => {navigate("/")}}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              onClick={() => {
                navigate('/Dashboard');
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <HomeOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Home" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => {navigate("/ManageTeamleader")}}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              onClick={() => {
                navigate('/ManageTeamleader');
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <PeopleAltOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                primary="Manage Teamleader"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => {navigate("/ManageCategory")}}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              onClick={() => {
                navigate('/ManageCategory');
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <CategoryOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                primary="Manage Category"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => {navigate("/ManageSubcategory")}}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              onClick={() => {
                navigate('/ManageSubcategory');
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <InboxIcon />
              </ListItemIcon>
              <ListItemText
                primary="Manage Subcategory"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => {navigate("/ViewReport")}}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              onClick={() => {
                navigate('/ViewReport');
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <AssessmentOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                primary="View Report"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
