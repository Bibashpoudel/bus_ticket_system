import { Box, Button, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardDatePicker } from '@material-ui/pickers';
import format from 'date-fns/format';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';
import { cancelTrip, deleteOutOfService } from '../../apis/bus/buses';
import { getBusById, getOutOfserviceBuses } from '../../apis/booking/booking';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';

// Language Switching data========
const switchData = {
  remove: <IntlMessages id={'remove'} />,
  add: <IntlMessages id={'add'} />,
  cancel: <IntlMessages id={'cancel'} />,
  outOfServiceOn: <IntlMessages id={'outOfServiceOn'} />,
  
};

const useStyles = makeStyles(( ) => ({
  paperContainer: {
    padding: 30,
  },
  dateContainer: {
    display: 'flex',
    alignContent: 'center',
    marginBottom: 20,
  },
}));

export default function MDOutOfService(props: any) {
  const { params } = props;
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };
 
  const { mutateAsync: cancelTripMutation, isSuccess, isError, error, isLoading, data } = useMutation(cancelTrip);
 
  const {
    mutateAsync: deleteCancelTripMutation,
    isSuccess: deleteSuccess,
    isError: isDeleteError,
    error: deleteError,
    isLoading: isDeleteLoading,
    data: deleteMessageData,
  } = useMutation(deleteOutOfService);
  
  const {
    data: busDetails,
    refetch,
    isPreviousData,
    isLoading: isBusdetailsLoading,
    isSuccess: isBusDetailsSuccess,
  } = useQuery(['bus-details', params?.id], getOutOfserviceBuses);

  const addOutOfServiceHandler = () => {
    console.log('Selected date', selectedDate);
    cancelTripMutation({ date: selectedDate, bus_id: params?.id });
  };

  const deleteOutOfserviceHandler = (obj: any) => {
    deleteCancelTripMutation(obj);
  };

  useEffect(() => {
    if (deleteMessageData && deleteMessageData.success) {
      refetch();
    }
  }, [deleteSuccess, deleteMessageData]);

  useEffect(() => {
    if (data && data.success) {
      refetch();
    }
  }, [isSuccess, data]);

  const outOfserviceList = busDetails && busDetails.data ? busDetails?.data : [];
  
  return (
    <Paper className={classes.paperContainer}>
      <div className={classes.dateContainer} style={{ display: 'flex', flexDirection: 'column' }}>
        <p style={{ width: '20%', paddingTop: 15 }}>{switchData.outOfServiceOn} :</p>
        {outOfserviceList?.map((obj: any, idx: number) => (
          <Box key={idx} style={{ display: 'flex', alignItems: 'center', margin: 5 }}>
            <span>{format(new Date(obj.date), 'yyyy-MM-dd')}</span>
            <Button
              onClick={() => deleteOutOfserviceHandler(obj)}
              variant="contained"
              color="secondary"
              style={{ marginLeft: 40 }}>
              {switchData.remove}
            </Button>
          </Box>
        ))}

        <Box style={{ display: 'flex', alignItems: 'center' }}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="DD/MM/YYYY"
            margin="normal"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            style={{ width: 'auto' }}
          />
          <Button onClick={addOutOfServiceHandler} variant="contained" color="primary">
            +{switchData.add}
          </Button>
        </Box>
      </div>
      <div>
        <Link href={`/dashboard/update-bus/${params?.id}`}>
          <Button variant="contained" color="secondary" style={{ marginLeft: 10 }}>
            {switchData.cancel}
          </Button>
        </Link>
      </div>
      <NotificationLoader
        message={(data?.success && data?.msg) || (deleteMessageData?.success && deleteMessageData?.msg)}
        loading={isLoading || isDeleteLoading}
        error={JSON.stringify(data?.errors)}
      />
    </Paper>
  );
}
