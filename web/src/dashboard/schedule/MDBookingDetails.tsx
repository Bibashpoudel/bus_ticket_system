import { Button, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import GrdTable from '../../components/MDGridTable';
import { format, isSameMinute } from 'date-fns';
import Link from 'next/link';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { useQuery, useMutation } from 'react-query';
import { getBusBookingDetails } from '../../apis/bus/buses';
import { getBusSchedule } from '../../apis/booking/booking';
import ReactToPrint from 'react-to-print';

// Language Switching data========
const switchData = {
  addBooking: <IntlMessages id={'addbooking'} />,
  filterName: <IntlMessages id={'filterbyname'} />,
  choose: <IntlMessages id={'choose'} />,
  search: <IntlMessages id={'search'} />,
  edit: <IntlMessages id={'edit'} />,
  delete: <IntlMessages id={'delete'} />,
  routes: <IntlMessages id={'routes'} />,
  totalPassenger: <IntlMessages id={'totalPassenger'} />,
  printList: <IntlMessages id={'printList'} />,
  editTrip: <IntlMessages id={'editTrip'} />,
  cancelTrip: <IntlMessages id={'cancelTrip'} />,
  all: <IntlMessages id={'all'} />,
};

interface Data {
  [key: string]: any;
}

interface HeadCell {
  key: string;
  label: any;
}

const headCells: HeadCell[] = [
  { key: 'ticketNo', label: <IntlMessages id={'ticketNo'} /> },
  { key: 'firstname', label: <IntlMessages id={'Passenger'} /> },
  { key: 'phone', label: <IntlMessages id={'phone'} /> },
  { key: 'from', label: <IntlMessages id={'from'} /> },
  { key: 'to', label: <IntlMessages id={'to'} /> },
  { key: 'seatName', label: <IntlMessages id={'seatName'} /> },
];

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    padding: 30,
    [theme.breakpoints.down('sm')]: {
      padding: 20,
    },
  },
  dsgnBox: {
    display: 'flex',
    alignItems: 'center',
  },
  formControl: {
    minWidth: 200,
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
}));

export default function MDBookingDetails(props: any) {
  const { params } = props;
  const [id, date] = params?.ids || [];
  console.log('Params in MDBookingDetails', params);
  const classes = useStyles();
  const [filterValue, updateFilterValue] = useState({} as any);
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [formatedBookingList, updateBookingList] = useState([]);
  console.log('formatedBooking List', formatedBookingList);
  const [pageInfo, updatePageInfo] = useState({ page: 1, size: 10 });
  const componentRef = React.useRef(null);

  const onBeforeGetContentResolve = React.useRef<(() => void) | null>(null);

  const [loading, setLoading] = React.useState(false);
  const [text, setText] = React.useState('Some cool text from the parent');

  const { data: dataBusList, refetch } = useQuery(
    ['BusList', filterValue.route_id, format(new Date(selectedDate), 'yyyy-MM-dd')],
    getBusSchedule,
  );

  const {
    mutateAsync: mutateAsyncGetBusListById,
    isSuccess: isSuccessGetBusList,
    isError: isErrorGetBusList,
    error: errorGetBusList,
    isLoading: isLoadingGetBusList,
    data: bookingDetails,
  } = useMutation(getBusBookingDetails);
  console.log('bookingDetails', bookingDetails);

  useEffect(() => {
    mutateAsyncGetBusListById({ id, date, page: pageInfo.page, size: pageInfo.size });
  }, []);

  const getSeatName = (obj: any) => {
    switch (obj.position) {
      case 'cabin':
        return `C${obj.seat_number}`;
      case 'left':
        return `A${obj.seat_number}`;
      case 'right':
        return `B${obj.seat_number}`;
      case 'back':
        return `L${obj.seat_number}`;
      default:
        return '';
    }
  };

  useEffect(() => {
    if (isSuccessGetBusList && bookingDetails && bookingDetails.success) {
      const res = bookingDetails?.data?.booking_details?.reduce((ac: any, a: any) => {
        let temp = ac.find((x: any) => x.ticket_id?._id === a.ticket_id?._id);
        if (!temp) ac.push({ ...a, seatNumbers: [{ ...a, seatName: getSeatName(a) }] });
        else temp.seatNumbers.push({ ...a, seatName: getSeatName(a) });
        return ac;
      }, []);

      updateBookingList(res.filter((obj: any) => obj.firstname));
    }
  }, [isSuccessGetBusList, bookingDetails]);

  const busNumber = bookingDetails?.data?.english.plate_number;
  const depAndArrive = `${bookingDetails?.data?.departure}-${bookingDetails?.data?.arrival}`;
  const from = bookingDetails?.data?.route_id?.from?.english?.location;
  const to = bookingDetails?.data?.route_id?.to?.english?.location;
  const routeName = `${bookingDetails?.data?.route_id?.from?.english?.location} - ${bookingDetails?.data?.route_id?.to?.english?.location}`;
  const passengers =
    bookingDetails && bookingDetails.data
      ? bookingDetails?.data.booking_details.filter((obj: any) => obj.status === 'sold-out')
      : [];

  const pageNoHandler = (type: string, value: any) => {
    if (type === 'page') {
      updatePageInfo({ ...pageInfo, [type]: value + 1 });
    } else {
      updatePageInfo({ ...pageInfo, [type]: value });
    }
  };

  const handleAfterPrint = React.useCallback(() => {
    console.log('`onAfterPrint` called'); // tslint:disable-line no-console
  }, []);

  const handleBeforePrint = React.useCallback(() => {
    console.log('`onBeforePrint` called'); // tslint:disable-line no-console
  }, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
    console.log('`onBeforeGetContent` called'); // tslint:disable-line no-console
    setLoading(true);
    setText('Loading new text...');

    return new Promise<void>((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        setLoading(false);
        setText('New, Updated Text!');
        resolve();
      }, 2000);
    });
  }, [setLoading, setText]);

  React.useEffect(() => {
    if (text === 'New, Updated Text!' && typeof onBeforeGetContentResolve.current === 'function') {
      onBeforeGetContentResolve.current();
    }
  }, [onBeforeGetContentResolve.current, text]);

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const reactToPrintTrigger = React.useCallback(() => {
    return (
      <Button size="medium" variant="contained" color="primary">
        {' '}
        {switchData.printList}{' '}
      </Button>
    );
  }, []);
  return (
    <Paper className={classes.paperContainer}>
      <div className={classes.wrapper}>
        <div style={{ margin: 0, padding: 0 }}>
          <div>{`Bus Plate Num: (${busNumber}):  ${routeName} ${depAndArrive}`}</div>
          <div style={{ marginTop: 10 }}>
            <h4>
              {switchData.totalPassenger} : {formatedBookingList.length}{' '}
            </h4>
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <ReactToPrint
            content={reactToPrintContent}
            documentTitle="AwesomeFileName"
            onAfterPrint={handleAfterPrint}
            onBeforeGetContent={handleOnBeforeGetContent}
            onBeforePrint={handleBeforePrint}
            removeAfterPrint
            trigger={reactToPrintTrigger}
          />
          <Link key={params?.id} href={`/dashboard/update-bus/${id}`}>
            <Button key={1} variant="contained" color="primary" style={{ margin: 5 }}>
              {switchData.editTrip}
            </Button>
          </Link>
          <Link key={params?.id} href={`/dashboard/out-of-service/${id}`}>
            <Button key={1} variant="contained" color="primary" style={{ margin: 0 }}>
              {switchData.cancelTrip}
            </Button>
          </Link>
        </div>
      </div>
      <div ref={componentRef}>
        <GrdTable
          headCells={headCells}
          pageNoHandler={pageNoHandler}
          totalRecordCount={bookingDetails?.totaldata}
          loading={isLoadingGetBusList}
          rows={
            formatedBookingList
              ? formatedBookingList.map((r: any) => {
                  const { seatNumbers } = r;
                  const seatName = seatNumbers.reduce((t: string, s: any) => {
                    t = `${t}${s.seatName},`;
                    return t;
                  }, '');
                  return {
                    ...r,
                    firstname: `${r.firstname} ${r.lastname}`,
                    from,
                    to,
                    seatName: `${seatNumbers.length} (${seatName.slice(0, -1)})`,
                    ticketNo: r?.ticket_id?.read_ticket_id,
                  };
                })
              : []
          }
        />
      </div>
    </Paper>
  );
}
