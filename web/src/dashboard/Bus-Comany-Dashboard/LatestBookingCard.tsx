import { Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useQuery } from 'react-query';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { getBookingLatestList, getLatestBookingList } from '../../apis/booking/booking';
import { format } from 'date-fns';
import { phoneSubString } from '../../utils/utils';

const switchData = {
  route: <IntlMessages id={'route'} />,
  email: <IntlMessages id={'email'} />,
  phone: <IntlMessages id={'phone'} />,
  name: <IntlMessages id={'name'} />,
  bus: <IntlMessages id={'bus'} />,
  time: <IntlMessages id={'time'} />,
  status: <IntlMessages id={'status'} />,
  departuretime: <IntlMessages id={'departuretime'} />,
};

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginBottom: 20,
  },
  pdiv: {
    width: '20%',
    [theme.breakpoints.down('sm')]: {
      width: '20%',
    },
  },
  pContainer: {
    marginBottom: 10,
    display: 'flex',
    width: '100%'

  },

}));

export default function BookCard() {
  const classes = useStyles();
  const {
    data: bookingDataList,
    refetch: refetchBookingDataList,
    isPreviousData,
    isLoading: isLoadingAllClients,
    isSuccess,
  } = useQuery(['latestBookinList'], getBookingLatestList);

  console.log('date and time', bookingDataList);



  return (
    <div className={classes.wrapper}>
      {bookingDataList &&
        bookingDataList?.data?.slice(0, 2).map((obj: any, id: number) => (
          <div key={id} style={{ display: 'flex', flexDirection: 'column', marginBottom: 30 }}>
            <div className={classes.pContainer}>
              <p className={classes.pdiv}>{switchData.name} :</p>
              <span> {`${obj?.passenger_name}`} </span>
            </div>
            <div className={classes.pContainer}>
              <p className={classes.pdiv}>{switchData.email} :</p>
              <span>{obj?.booking_id[0]?.email}</span>
            </div>
            <div className={classes.pContainer}>
              <p className={classes.pdiv}>{switchData.phone} :</p>
              {phoneSubString(obj?.booking_id[0]?.phone)}
            </div>
            <div className={classes.pContainer}>
              <p className={classes.pdiv}>{switchData.bus} :</p>
              <span> {`${obj?.bus_id?.english.name}(${obj?.bus_id?.english?.bus_number})`}</span>
            </div>
            <div className={classes.pContainer}>
              <p className={classes.pdiv}>{switchData.route} :</p>
              <span>{`${obj?.route_id?.from?.english?.location} - ${obj?.route_id?.to?.english?.location}`}</span>
            </div>
            <div className={classes.pContainer}>
              <p className={classes.pdiv}>{switchData.time} :</p>
              <span>{obj?.date}</span>
            </div>
            <div className={classes.pContainer}>
              <p className={classes.pdiv} style={{ minWidth: 150 }}>
                {switchData.departuretime}:
              </p>
              {obj?.bus_id?.departure && <span>{obj?.bus_id?.departure}</span>}
            </div>
            <div className={classes.pContainer}>
              <p className={classes.pdiv}>{switchData.status} :</p>
              <span>{obj.status}</span>
            </div>
            <Divider />
          </div>
        ))}
    </div>
  );
}
