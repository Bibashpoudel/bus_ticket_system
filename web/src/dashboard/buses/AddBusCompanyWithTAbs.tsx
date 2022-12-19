import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PaymentSetting from './PaymentSetting';
import Link from 'next/link';
import MDBusCompanyManagement from './MDBusCompanyManagement';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import MDAddBusCompanyManagement from './MDAddBusCompanyManagement';

// Language Switching data========
const switchData = {
  busCompany: <IntlMessages id={'busCompany'} />,
  paymentSetting: <IntlMessages id={'paymentSetting'} />,
  choose: <IntlMessages id={'choose'} />,
  search: <IntlMessages id={'search'} />,
  edit: <IntlMessages id={'edit'} />,
  delete: <IntlMessages id={'delete'} />,
  routes: <IntlMessages id={'routes'} />,
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
        <Box p={0}>
          <Typography>{children}</Typography>
        </Box>
      )}
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
  },
}));

export default function FullWidthTabs(props: any) {
  const { params } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: any) => {
    setValue(index);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default" aria-disabled>
        <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary">
          <Tab label={switchData.busCompany} {...a11yProps(0)} />
          {params?.id &&
            <Tab label={switchData.paymentSetting} {...a11yProps(1)} disabled={params?.id ? false : true} />
          }
        </Tabs>
      </AppBar>
      <>
        {/* <Link href="/dashboard/bus-company-management"> */}
        <TabPanel value={value} index={0}>
          {/* <MDBusCompanyManagement /> */}
          <MDAddBusCompanyManagement {...props} />
        </TabPanel>
        {/* </Link> */}

        <TabPanel value={value} index={1}>
          <PaymentSetting {...props} />
        </TabPanel>
      </>
    </div>
  );
}
