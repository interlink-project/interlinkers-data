
import { useState } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { AccountBox, Folder, Dashboard, Notifications } from '@material-ui/icons';
import { grey } from '@material-ui/core/colors';

// /dashboard/account

const sections = [{
  title: 'Overview',
  path: '/dashboard',
  icon: <Dashboard />
},
{
  title: 'Catalogue',
  path: '/dashboard/catalogue',
  icon: <Folder />,
},
{
  title: 'Notifications',
  path: '/notifications',
  icon: <Notifications />,
},
{
  title: 'Account',
  path: '/myaccount',
  icon: <AccountBox />,
}
];

const DashboardMobileAppbar = () => {
  const [value, setValue] = useState(0);

  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      sx={{
        borderTop: `1px solid primary.main`,
        paddingTop: "4px",
        position: "fixed",
        left: "0",
        bottom: "0",
        width: "100%",
        textAlign: "center"
      }}
    >
      {sections.map(el => <BottomNavigationAction key={el.path} label={el.title} icon={el.icon} /> )}
    </BottomNavigation>
  );
};

export default DashboardMobileAppbar;
