import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Router from 'next/router';
import PromoCodeTable from './PromoCodeTable';
import EmailSetting from './EmailSetting';
import PaymentMethodSetting from './PaymentMethodSetting';
import SupportTicketCategory from './ticket-category/SupportTicketCategory';
import CMS from './cms/Index';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import MDLocationList from '../buses/MDLocationList';

// Language Switching data========
const switchData = {
  emailSetting: <IntlMessages id={'emailSetting'} />,
  paymentMethodSetting: <IntlMessages id={'paymentMethodSetting'} />,
  cms: <IntlMessages id={'cms'} />,
  supportTicketCategory: <IntlMessages id={'supportTicketCategory'} />,
  promoCode: <IntlMessages id={'promoCode'} />,
  location: <IntlMessages id={'location'} />,
};

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}>
      {value === index && (
        <div>
          <Typography>{children}</Typography>
        </div> )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    [theme.breakpoints.down('sm')]: {},
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

export default function Settings(props: any) {
  console.log('Props in settings', props);
  const { params } = props;
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [userInfo, setUserInfo] = useState({} as any);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
    Router.push(`/dashboard/setting/${newValue}`);
  };

  useEffect(() => {
    const userData = sessionStorage.getItem('user') || '';
    setValue(parseInt(params?.tabId, 10));
    if (userData) {
      setUserInfo(JSON.parse(userData)?.user);
    }
  }, []);

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default" aria-disabled className={classes.overFolow}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          // style={{overflow:'!scroll'}}
        >
          {userInfo?.role === 'bus-company' && <Tab label={switchData.promoCode} {...a11yProps(0)} />}
          {(userInfo?.role === 'super-admin' || userInfo?.role === 'admin') && (
            <Tab label={switchData.emailSetting} {...a11yProps(0)} />
          )}
          {(userInfo?.role === 'super-admin' || userInfo?.role === 'admin') && (
            <Tab label={switchData.paymentMethodSetting} {...a11yProps(1)} />
          )}
          {(userInfo?.role === 'super-admin' || userInfo?.role === 'admin') && (
            <Tab label={switchData.cms} {...a11yProps(2)} />
          )}
          {(userInfo?.role === 'super-admin' || userInfo?.role === 'admin') && (
            <Tab label={switchData.supportTicketCategory} {...a11yProps(3)} />
          )}
          {(userInfo?.role === 'super-admin' || userInfo?.role === 'admin') && (
            <Tab label={switchData.location} {...a11yProps(4)} />
          )}
        </Tabs>
      </AppBar>
      {userInfo?.role === 'bus-company' ? (
        <TabPanel value={value} index={0}>
          <PromoCodeTable />
        </TabPanel>
      ) : (
        <>
          <TabPanel value={value} index={0}>
            <EmailSetting />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <PaymentMethodSetting />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <CMS />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <SupportTicketCategory />
          </TabPanel>
          <TabPanel value={value} index={4}>
            <MDLocationList />
          </TabPanel>
        </>
      )}
    </div>
  );
}
