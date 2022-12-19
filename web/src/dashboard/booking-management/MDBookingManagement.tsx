import { Box, Button, InputBase, Modal, Paper, Switch, Tab, Tabs } from '@material-ui/core';
import Search from '@material-ui/icons/Search';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import GrdTable from '../../components/MDGridTable';
import Link from 'next/link';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { getUser } from '../../apis/user';
import { useQuery, useMutation } from 'react-query';
import PopOverComponent from '../../components/PopOverComponent';
import { cancelBookingOnBackButton, cancelBookings, getBookingList } from '../../apis/booking/booking';
import { format, isSameHour } from 'date-fns';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';
import { useIntl } from 'react-intl';
import ReactToPrint from 'react-to-print';
import MengedgnaTicket from '../../components/MengedgnaTicket';

// Language Switching data========
const switchData = {
  addBooking: <IntlMessages id={'addbooking'} />,
  filterName: <IntlMessages id={'filterbyname'} />,
  choose: <IntlMessages id={'choose'} />,
  search: <IntlMessages id={'search'} />,
  edit: <IntlMessages id={'edit'} />,
  cancel: <IntlMessages id={'cancel'} />,
  routes: <IntlMessages id={'routes'} />,
  all: <IntlMessages id={'all'} />,
  confirmed: <IntlMessages id={'confirmed'} />,
  pending: <IntlMessages id={'pending'} />,
  verify: <IntlMessages id={'verify'} />,
  details: <IntlMessages id={'details'} />,
  yes: <IntlMessages id={'yes'} />,
  no: <IntlMessages id={'no'} />,
  exitTicketMsg: <IntlMessages id={'exitTicketMsg'} />,
  ticketNo: <IntlMessages id={'ticketNo'} />,
};

interface Data {
  [key: string]: any;
}

interface HeadCell {
  key: string;
  label: any;
}

const headCells: HeadCell[] = [
  { key: 'read_ticket_id', label: <IntlMessages id={'ticketNo'} /> },
  { key: 'name', label: <IntlMessages id={'passenger'} /> },
  { key: 'date_time', label: <IntlMessages id={'datetime'} /> },
  { key: 'bus', label: <IntlMessages id={'busNo'} /> },
  { key: 'route', label: <IntlMessages id={'routes'} /> },
  { key: 'numberOfSeat', label: <IntlMessages id={'numofseat'} /> },
  { key: 'ticket', label: <IntlMessages id={'ticket'} /> },
  { key: 'status', label: <IntlMessages id={'status'} /> },
  { key: 'action', label: <IntlMessages id={'action'} /> },
];

const useStyles = makeStyles((theme) => ({
  Container: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 15,
  },
  srchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 15,
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
    },
  },
  addSearchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 15,
    [theme.breakpoints.down('sm')]: {
      paddingTop: 0,
    },
  },
  mulButtonContainer: {
    display: 'flex',
    alignItems: 'end',
    justifyContent: 'space-around',

    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginTop: 10,
    },
  },
  mulButton: {
    height: 25,
    textTransform: 'capitalize',
    marginRight: 10,
    [theme.breakpoints.down('sm')]: {
      marginRight: 5,
    },
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    width: '32%',
    justifyContent: 'space-around',
    [theme.breakpoints.down('sm')]: {
      width: '75%',
      marginTop: 10,
    },
  },
  searchDiv: {
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    marginRight: 5,
    [theme.breakpoints.down('sm')]: {},
  },
  addBookinBtn: {
    textTransform: 'capitalize',
    background: '#4caf50',
    color: '#ffffff',
    marginRight: 10,
    [theme.breakpoints.down('sm')]: {
      width: '68%',
      marginRight: 5,
    },
  },
  formControl: {
    minWidth: 300,
    marginLeft: 10,
  },
  editBtn: {
    marginRight: 5,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 5,
      width: '100%',
    },
  },
  paper: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: 400,
    height: '15%',
    backgroundColor: theme.palette.background.paper,
    // border: '2px solid #000',
    // boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

export default function MDBookingManagement() {
  const classes = useStyles();
  const { locale } = useIntl();

  const [userInfo, setUserInfo] = useState({} as any);
  const [filterValue, updateFilterValue] = useState({
    status: '',
    to: '',
    from: Date.now(),
    route_id: 'all',
    bus_number: 'all',
    passenger_name: '',
  } as any);
  const [formatedBookingList, updateBookingList] = useState([]);
  const [removeAfterDelete, updateRemoveAfterDelete] = useState(true);
  const [pageInfo, updatePageInfo] = useState({ page: 1, size: 10 });
  const [modalStyle] = React.useState(getModalStyle);
  const [open, toggleModal] = useState<any>(false);
  // const componentRef = React.useRef(null);
  // const onBeforeGetContentResolve = React.useRef<(() => void) | null>(null);

  const {
    data: bookingList,
    refetch,
    isPreviousData,
    isLoading: isLoadingAllClients,
    isSuccess,
    remove,
  } = useQuery(
    [
      'booking-list',
      filterValue.status,
      filterValue.to ? new Date(filterValue.to) : '',
      new Date(filterValue.from),
      filterValue.route_id,
      filterValue.bus_number,
      filterValue.passenger_name,
      pageInfo?.page,
      pageInfo.size,
    ],
    getBookingList,
  );

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

  const getTicketBookStatus = (userInfo: any) => {
    if (
      (userInfo && userInfo?.role === 'bus-company') ||
      userInfo?.role === 'bus-owner' ||
      userInfo?.role === 'bus-manager' ||
      userInfo?.role === 'bus-counter'
    ) {
      return 'Counter';
    }
    if ((userInfo && userInfo?.role === 'admin') || userInfo?.role === 'super-admin') {
      return 'Admin';
    } else {
      return 'Mobile';
    }
  };

  useEffect(() => {
    if (isSuccess && bookingList && bookingList.success) {
      const res = bookingList?.data?.map((br: any) => {
        const { firstname, lastname, ticketed_by, isPaid, date, payment_id, status } = br.booking_id[0] || {};
        // let temp = ac.find((x: any) => x.ticket_id === a.ticket_id);
        // if (!temp) ac.push({ ...a, seatNumbers: [{ ...a, seatName: getSeatName(a) }] });
        // else temp.seatNumbers.push({ ...a, seatName: getSeatName(a) });
        // return ac;
        return {
          ...br,
          firstname,
          lastname,
          ticketed_by,
          payment_id,
          date: date,
          isPaid: isPaid,
          booking_id: br?.booking_id?.map((a: any) => ({ ...a, seatName: getSeatName(a) })),
          isReserved: status === 'reserved',
        };
      });

      if (removeAfterDelete) {
        remove();
        updateRemoveAfterDelete(false);
      }
      updateBookingList(res.filter((obj: any) => obj.firstname));
    }
  }, [isSuccess, bookingList]);

  const updateFilterValueHandler = (key: string, value: any) => {
    if (key === 'status') {
      updateFilterValue({
        ...filterValue,
        route_id: '',
        bus_number: '',
        passenger_name: '',
        [key]: value,
      });
    } else {
      updateFilterValue({ ...filterValue, [key]: value });
    }
  };

  const {
    mutateAsync: cancelBookingOnBackButtonMutation,
    isSuccess: isSuccesscancelBookingOnBackButton,
    isError: isErrorcancelBookingOnBackButton,
    error: errorCancelBookingOnBackButton,
    isLoading: isLoadingcancelBookingOnBackButton,
    data: cancelBookResponseOnBackButton,
  } = useMutation(cancelBookingOnBackButton);

  useEffect(() => {
    if (isSuccesscancelBookingOnBackButton && cancelBookResponseOnBackButton.success) {
      toggleModal(null);
      refetch();
    }
  }, [isSuccesscancelBookingOnBackButton, cancelBookResponseOnBackButton]);

  const cancelBookinOnBackButtonHelper = (obj: any) => {
    console.log('RECORD TO BE DELETE', obj);
    const { seatNumbers } = obj;
    cancelBookingOnBackButtonMutation({
      booking_id: seatNumbers?.map((obj: any) => obj._id),
    });
  };

  const openModalForCancelConfirmation = (obj: any) => {
    toggleModal(obj);
  };

  const {
    mutateAsync: cancelBookingMutation,
    isSuccess: isSuccesscancelBooking,
    isError: isErrorcancelBooking,
    error: errorCancelBooking,
    isLoading: isLoadingcancelBooking,
    data: cancelBookResponse,
  } = useMutation(cancelBookings);

  const cancelBookingsHandler = (obj: any) => {
    console.log('RECORD TO BE DELETE', obj);
    const { booking_id } = open;
    cancelBookingOnBackButtonMutation({
      booking_id: booking_id?.map((obj: any) => obj._id),
    });
  };

  useEffect(() => {
    if (isSuccesscancelBooking) {
      refetch();
    }
  }, [isSuccesscancelBooking, cancelBookResponse]);

  const pageNoHandler = (type: string, value: any) => {
    if (type === 'page') {
      updatePageInfo({ ...pageInfo, [type]: value + 1 });
    } else {
      updatePageInfo({ ...pageInfo, [type]: value });
    }
  };

  useEffect(() => {
    const userData = sessionStorage.getItem('user') || '';
    if (userData) {
      setUserInfo(JSON.parse(userData)?.user);
    }
  }, []);

  const modalCloseHandler = () => {
    toggleModal(null);
  };

  return (
    <div>
      <div className={classes.srchContainer}>
        <Box className={classes.addSearchContainer}>
          <Link href="/dashboard/add-booking-management">
            <Button variant="contained" size="small" className={classes.addBookinBtn}>
              +{switchData.addBooking}
            </Button>
          </Link>
          <div className={classes.searchDiv}>
            <InputBase
              onChange={(e) => updateFilterValueHandler('passenger_name', e.target.value)}
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              style={{ paddingLeft: 5 }}
            />
            <Search style={{ marginRight: 5 }} />
          </div>
          <PopOverComponent updateFilterValueHandler={updateFilterValueHandler} filterValue={filterValue} />
        </Box>
        <Box className={classes.buttonContainer}>
          <Button
            onClick={() => updateFilterValueHandler('status', '')}
            size="small"
            variant="outlined"
            color="primary"
            style={{ height: 25, textTransform: 'capitalize' }}>
            {switchData.all}
          </Button>
          <Button
            onClick={() => updateFilterValueHandler('status', 'sold-out')}
            variant="outlined"
            size="small"
            color="primary"
            style={{ height: 25, textTransform: 'capitalize' }}>
            {switchData.confirmed}
          </Button>
          <Button
            onClick={() => updateFilterValueHandler('status', 'reserved')}
            variant="outlined"
            size="small"
            color="primary"
            style={{ height: 25, textTransform: 'capitalize' }}>
            {switchData.pending}
          </Button>
        </Box>
      </div>
      {/* @ts-ignore */}
      <GrdTable
        headCells={headCells}
        pageNoHandler={pageNoHandler}
        totalRecordCount={bookingList?.totaldata}
        loading={isLoadingAllClients}
        rows={
          formatedBookingList
            ? formatedBookingList.map((r: any) => {
              const {
                passenger_name,
                lastname,
                isPaid,
                created_at,
                bus_id,
                seatNumbers,
                added_by,
                date,
                route_id,
                payment_id,
                booking_id,
                isReserved,
              } = r;
              console.log('RECORD', r, payment_id);
              const { from, to } = bus_id?.route_id || {};
              const seatName = booking_id.reduce((t: string, s: any) => {
                t = `${t}${s.seatName},`;
                return t;
              }, '');
              const isVerified =
                (r?.ticketed_by === 'admin' || r?.ticketed_by === 'online-web' || r?.ticketed_by === 'online-app') &&
                isReserved;
              return {
                ...r,
                name: `${passenger_name}`,
                status: isPaid ? 'Confirmed' : 'Pending',
                date_time: `${date} ${bus_id?.departure}`,
                bus:
                  userInfo.role === 'super-admin' || userInfo.role === 'admin'
                    ? `${r?.bus_id?.[locale]?.name}(${r?.bus_id?.[locale]?.bus_number})`
                    : `${r?.bus_id?.[locale]?.plate_number}(${r?.bus_id?.[locale]?.bus_number})`,
                // bus: bus_id?.[locale]?.bus_number,
                route: `${route_id?.from?.[locale]?.location} - ${route_id?.to?.[locale]?.location}`,
                numberOfSeat: `${booking_id.length} (${seatName.slice(0, -1)})`,
                ticket: r?.ticketed_by,
                action: [
                  isVerified ? (
                    <Link href={`/verify-receipt/${r._id}`}>
                      <Button
                        key={2}
                        variant="contained"
                        color="primary"
                        disabled={userInfo.role === 'super-admin' || userInfo.role === 'admin' ? false : true}>
                        {switchData.verify}
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Button
                        onClick={() => openModalForCancelConfirmation(r)}
                        key={2}
                        disabled={isPaid}
                        variant="contained"
                        style={{ marginBottom: 5 }}
                        color="secondary">
                        {switchData.cancel}
                      </Button>

                      {/* <Link href={{ pathname: `/ticket-details/${r._id}`, query: { lang: locale } }} passHref >
                        <a target="_blank">
                          <Button size="medium" variant="contained" color="primary">
                            {switchData.details}
                          </Button>
                        </a>

                      </Link> */}

                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={`https://www.mengedegna.com/ticket-details/${r._id}?lang=${locale}`}>
                        <Button size="medium" variant="contained" color="primary">
                          {switchData.details}
                        </Button>
                      </a>
                    </>
                  ),
                ],
              };
            })
            : []
        }
      // loading={isLoadingAllClients}
      />
      <Modal
        keepMounted
        open={open}
        // onClose={modalCloseHandler}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <div style={modalStyle} className={classes.paper}>
          <h4>{switchData.exitTicketMsg}</h4>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={cancelBookingsHandler}
              style={{ marginRight: 5 }}
              variant="contained"
              color="primary"
              size="small">
              {switchData.yes}
            </Button>
            <Button onClick={modalCloseHandler} variant="contained" color="secondary" size="small">
              {switchData.no}
            </Button>
          </div>
        </div>
      </Modal>
      <NotificationLoader
        message={cancelBookResponse?.success && 'Ticket cancel successfully'}
        loading={isLoadingcancelBooking || isLoadingcancelBookingOnBackButton}
        error={JSON.stringify(cancelBookResponse?.errors)}
      />
    </div>
  );
}
