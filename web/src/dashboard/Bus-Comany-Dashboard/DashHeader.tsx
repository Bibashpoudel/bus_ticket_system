import { Divider, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import EventNoteIcon from '@material-ui/icons/EventNote';
import DirectionsBusIcon from '@material-ui/icons/DirectionsBus';
import { useQuery } from 'react-query';
import { getDashList } from '../../apis/dashboard/busDashboard';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';

// Language Switching data========
const switchData = {
  latestBooking: <IntlMessages id={'latestBooking'} />,
  nextDeparture: <IntlMessages id={'nextDeparture'} />,
  viewAll: <IntlMessages id={'viewAll'} />,
  newBookingToday: <IntlMessages id={'newBookingToday'} />,
  busesToDepartureToday: <IntlMessages id={'busesToDepartureToday'} />,
  busCompany: <IntlMessages id={'busCompany'} />,
  buses: <IntlMessages id={'buses'} />,
  route: <IntlMessages id={'route'} />,
};

const useStyles = makeStyles((theme) => ({
  wrapper: {
    height: '100vh',
    width: '100vw',
  },
  paperContainer: {
    padding: 30,
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      padding: 15,
    },
  },
  box: {
    width: '30%',
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      marginRight: 10,
    },
  },
  iconContainer: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
}));

export default function DashHeader() {
  const classes = useStyles();
  const {
    data: dataList,
    refetch: refetchDataList,
    isPreviousData,
    isLoading: isLoadingAllClients,
    isSuccess,
  } = useQuery(['dashboardDataList'], getDashList);
  console.log('BUS COMPANY DASBOARD', dataList);
  return (
    <div>
      <Paper className={classes.paperContainer}>
        <div className={classes.box}>
          <div className={classes.iconContainer}>
            <div style={{ marginRight: 10 }}>
              <EventNoteIcon fontSize="large" style={{ height: 50, width: 50 }} />
            </div>
            <div style={{ background: '' }}>
              <p>{dataList?.data?.new_bookings}</p>
              <p>{switchData.newBookingToday}</p>
            </div>
          </div>
          <Divider orientation="vertical" />
        </div>
        <div className={classes.box}>
          <div className={classes.iconContainer}>
            <div style={{ marginRight: 10 }}>
              <DirectionsBusIcon fontSize="large" style={{ height: 50, width: 50 }} />
            </div>
            <div style={{ background: '' }}>
              <p>{dataList?.data?.new_departure}</p>
              <p>{switchData.busesToDepartureToday} </p>
            </div>
          </div>
          <Divider orientation="vertical" />
        </div>
        <Divider />
        <div className={classes.box}>
          <div className={classes.iconContainer}>
            <div style={{ marginRight: 10 }}>
              <DirectionsBusIcon fontSize="large" style={{ height: 50, width: 50 }} />
            </div>
            <div style={{ background: '' }}>
              <p>
                {dataList?.data?.total_route} {switchData.route}
              </p>
              <p>
                {dataList?.data?.total_bus} {switchData.buses}
              </p>
            </div>
          </div>
        </div>
      </Paper>
    </div>
  );
}
