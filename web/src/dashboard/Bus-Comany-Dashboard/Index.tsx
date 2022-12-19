import { Button, Divider, Link, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import DashHeader from './DashHeader';
import LatestBookingCard from './LatestBookingCard';
import NextDepartureCard from './NextDepartureCard';

// Language Switching data========
const switchData = {
  latestBooking: <IntlMessages id={'latestBooking'} />,
  nextDeparture: <IntlMessages id={'nextDeparture'} />,
  viewAll: <IntlMessages id={'viewAll'} />,
  

};

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
  },
  boxWraper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 30,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      padding: 15,
    },
  },
  box1: {
    width: '45%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  box2: {
    width: '45%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  viewAllContainer: {
    marginBottom: 20,
  },
}));

export default function Index() {
  const classes = useStyles();
  return (
    <Paper className={classes.container}>
      <DashHeader />
      <div className={classes.boxWraper}>
        {/* box1 */}
        <div className={classes.box1} style={{ background: '' }}>
          <div className={classes.viewAllContainer}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link href="/dashboard/booking-management">
                <Button variant="contained" color="primary" size="small" style={{ margin: 10 }}>
                 {switchData.viewAll}
                </Button>
              </Link>
            </div>
            <div>
              <Typography variant="h3" gutterBottom>
               {switchData.latestBooking}
              </Typography>
            </div>
            <Divider />
          </div>

          <LatestBookingCard />
        
        </div>
        {/* box2 */}
        <div className={classes.box2}>
          <div className={classes.viewAllContainer}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link href="/dashboard/schedule">
                <Button variant="contained" color="primary" size="small" style={{ margin: 10 }}>
                  {switchData.viewAll}
                </Button>
              </Link>
            </div>
            <div>
              <Typography variant="h3" gutterBottom>
               {switchData.nextDeparture}
              </Typography>
            </div>
            <Divider />
          </div>
          <NextDepartureCard />
        
        </div>
      </div>
    </Paper>
  );
}
