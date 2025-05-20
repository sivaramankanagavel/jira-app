import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import HomeIcon from '@mui/icons-material/Home';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';

const sideNavMenuData = [
  {
    name: "Home",
    icon: <HomeIcon sx={{ color: "white" }}/>,
    dropdown: false,
  },
  {
    name: "Admin",
    icon: <AdminPanelSettingsIcon sx={{ color: "white" }}/>,
    dropdown: false,
  },
  {
    name: "Projects",
    icon: <AccountTreeIcon sx={{ color: "white" }}/>,
    dropdown: true,
  },
  {
    name: "Board",
    icon: <ViewKanbanIcon sx={{ color: "white" }}/>,
    dropdown: false,
  },
];

export default sideNavMenuData;
