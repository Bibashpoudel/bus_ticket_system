


import React, { useEffect, useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import BusDetails from './BusDetails';
import PassangerDetails from './PassangerDetails';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';

const switchData = {
  distanceTraveled: <IntlMessages id={'distanceTraveled'} />,
  travelerDetail: <IntlMessages id={'travelerDetail'} />,

};

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
  },
  overFolow: {
    // overflow:'scroll',
    // background:'red',
    [theme.breakpoints.down('sm')]: {
      overFlow: 'scroll',
      marginBottom: 20,
    },
  },
}));

export default function MDReporting() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [userInfo, setUserInfo] = useState({} as any);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  useEffect(() => {
    const userData = sessionStorage.getItem('user') || '';
    if (userData) {
      setUserInfo(JSON.parse(userData)?.user);
    }
  }, []);



  return (
    <div>


      {(userInfo?.role === 'super-admin' || userInfo?.role === 'admin') ?
        <div className={classes.root}>
          <AppBar position="static" color="default" aria-disabled className={classes.overFolow}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"

            >
              <Tab label={switchData.distanceTraveled}  {...a11yProps(0)} />
              <Tab label={switchData.travelerDetail} {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <BusDetails />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <PassangerDetails />
            </TabPanel>

          </SwipeableViews>
        </div>
        :
        <BusDetails />
      }
    </div>
  );
}
