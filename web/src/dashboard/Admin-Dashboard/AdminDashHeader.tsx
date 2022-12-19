import { Divider, Paper } from '@material-ui/core';
import { Height } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import EventNoteIcon from '@material-ui/icons/EventNote';
import DirectionsBusIcon from '@material-ui/icons/DirectionsBus';
import { getDashList } from '../../apis/dashboard/busDashboard';
import { useQuery } from 'react-query';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';

// Language Switching data========
const switchData = {
  newBookingToday: <IntlMessages id={'newBookingToday'} />,
  busesToDepartureToday: <IntlMessages id={'busesToDepartureToday'} />,
  busCompany: <IntlMessages id={'busCompany'} />,
  latestBooking: <IntlMessages id={'latestBooking'} />,
  nextDeparture: <IntlMessages id={'nextDeparture'} />,
  available: <IntlMessages id={'available'} />,
  booked: <IntlMessages id={'booked'} />,
  selected: <IntlMessages id={'selected'} />,
  passengerDetails: <IntlMessages id={'passengerDetails'} />,
  phone: <IntlMessages id={'phone'} />,
  paidBy: <IntlMessages id={'paidBy'} />,
  travelDetails: <IntlMessages id={'travelDetails'} />,
  paymentDetails: <IntlMessages id={'paymentDetails'} />,
  perTicketCost: <IntlMessages id={'perTicketCost'} />,
  totalCost: <IntlMessages id={'totalCost'} />,
  timeOut: <IntlMessages id={'timeOut'} />,
  confirmTicket: <IntlMessages id={'confirmTicket'} />,
  firstname: <IntlMessages id={'firstname'} />,
  lastname: <IntlMessages id={'lastname'} />,
  email: <IntlMessages id={'email'} />,
  choose: <IntlMessages id={'choose'} />,
  route: <IntlMessages id={'route'} />,
  cancel: <IntlMessages id={'cancel'} />,
};

const useStyles = makeStyles((theme) => ({
  wrapper: {},
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
      width: '35%',
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
  console.log('ADMIN DASHBOARD CLLED', dataList);
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.paperContainer}>
        <div className={classes.box}>
          <div className={classes.iconContainer}>
            <div style={{ marginRight: 10 }}>
              <EventNoteIcon fontSize="large" style={{ height: 50, width: 50 }} />
            </div>
            <div style={{ background: '' }}>
              <p>{dataList?.data?.new_bookings}</p>
              <p>{switchData.newBookingToday} </p>
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
              <p>{switchData.busesToDepartureToday}</p>
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
              <p>{dataList?.data?.total_company} </p>
              <p>{switchData.busCompany} </p>
            </div>
          </div>
        </div>
      </Paper>
    </div>
  );
}
