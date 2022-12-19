import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import BusSeatLayout from '../buses/MDBusSeatLayout';
import { useMutation, useQuery } from 'react-query';
import { addBooking, getBusById, cancelBookings, cancelBookingOnBackButton } from '../../apis/booking/booking';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';
import Router from 'next/router';
import MDSeat from '../../components/MDSeat';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import router from 'next/router';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useIntl } from 'react-intl';
import { getAdminPaymentSettingDetails } from '../../apis/settings/payment';

const seat = '/images/seats/seat.png';
const reserved = '/images/seats/reserved.png';
const selected = '/images/seats/selected.png';
const sold = '/images/seats/sold.png';

// Language Switching data========
const switchData = {
  continue: <IntlMessages id={'continue'} />,
  amount: <IntlMessages id={'amount'} />,
  seats: <IntlMessages id={'seats'} />,
  back: <IntlMessages id={'back'} />,
  Reserved: <IntlMessages id={'reserved'} />,
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
  referenceNo: <IntlMessages id={'referenceNo'} />,
  choose: <IntlMessages id={'choose'} />,
  route: <IntlMessages id={'route'} />,
  cancel: <IntlMessages id={'cancel'} />,
  commission: <IntlMessages id={'commission'} />,
  accountNumber: <IntlMessages id={'accountNumber'} />,
  etb: <IntlMessages id={'etb'} />,
  gender: <IntlMessages id={'gender'} />,
  age: <IntlMessages id={'age'} />,
};

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    padding: 10,
    [theme.breakpoints.down('sm')]: {
      paddingBottom: 20,
      padding: 0,
    },
  },
  dsgnBox: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 15,
  },
  formControl: {
    minWidth: 200,
  },

  seatContainer: {
    display: 'flex',

    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
    },
  },
  seatWrapper: {
    background: 'white',
    width: '50%',

    height: 'auto',
    marginBottom: 30,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  seatsAmountContainer: {
    background: '',
    width: '45%',
    height: '40%',
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  seatAmountWrapper: {
    padding: 10,
    width: '60%',
    height: '30%',
    marginTop: 90,
    [theme.breakpoints.down('sm')]: {
      width: '90%',
      marginTop: 0,
      marginBottom: 10,
    },
  },
  pSeatAmount: {
    width: '57%',
    [theme.breakpoints.down('sm')]: {
      width: '30%',
    },
  },
  aSeatAmount: {
    width: '57%',
    [theme.breakpoints.down('sm')]: {
      width: '35%',
    },
  },
  btnContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 25,
      marginTop: 5,
    },
  },
  passengerTraverlContainer: {
    padding: 30,
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
  },
  passengerTravelDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
    },
  },
  passengerContainer: {
    width: '60%',
    padding: 30,
    marginRight: 20,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      padding: 20,
    },
  },
  pBox: {
    width: '25%',
    marginTop: 10,
    [theme.breakpoints.down('sm')]: {
      width: '30%',
      marginTop: 5,
    },
  },
  pBoxPhone: {
    width: '33%',
    marginTop: 10,
    [theme.breakpoints.down('sm')]: {
      width: '41%',
      marginTop: 5,
    },
  },
  travelContainer: {
    width: '40%',
    padding: 10,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginTop: 20,
      padding: 20,
    },
  },
  pTravel: {
    width: '30%',
    [theme.breakpoints.down('sm')]: {
      width: '25%',
    },
  },
  timeRemainSection: {
    textTransform: 'uppercase',
    marginTop: 40,
    marginBottom: 30,
    [theme.breakpoints.down('sm')]: {
      marginTop: 30,
      marginBottom: 20,
    },
  },
  emailTicketContainer: {
    display: 'flex',
    marginTop: 60,
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      marginTop: 20,
      padding: 10,
    },
  },
}));
// Cash/TeleBirr/CBE

const paidType = [
  { id: 1, name: 'TeleBirr', value: 'telebirr' },
  // { id: 2, name: 'CBE', value: 'cbe' },
  { id: 4, name: 'Cash', value: 'cash' },
];

const genderType = [
  { id: 1, name: 'Male', value: '1' },
  // { id: 2, name: 'CBE', value: 'cbe' },
  { id: 2, name: 'Female', value: '2' },
  { id: 3, name: 'Other', value: '3' },
];

export default function BookingForm(props: any) {
  const { params } = props;
  const { locale } = useIntl();
  const [id, date] = params.ids;
  const classes = useStyles();
  const [formValue, updateFormValue] = useState({} as any);
  const [showUser, toggleShowUser] = useState<boolean>(true);
  const [selectedSeat, setSelectedSeat] = useState([] as any);
  const [currentSelectedSeat, setCurrentSeat] = useState({} as any);
  const [isBooking, toggleBooking] = useState(false);
  const [timerState, setTimer] = useState<any>(null);
  const [timer, updateTimer] = useState<number>(600);
  const [payment_type, updatePaymentType] = useState<string>('telebirr');
  const [gender_type, updateGenderType] = useState<string>('');
  const [notification, updateNotification] = useState<string>('');
  const [successStatus, updateSuccessStatus] = useState<boolean>();
  const [userInfo, upadateUserInfo] = useState({} as any);
  const [localError, updateLocalError] = useState('' as any);

  useEffect(() => {
    const userData = sessionStorage.getItem('user') as any;
    if (userData) {
      const { user, ...rest } = JSON.parse(userData) || {};
      upadateUserInfo(user);
      if (user.role === 'super-admin' || user.role === 'admin') {
        updateTimer(1800);
      }
    }
  }, []);

  const {
    refetch,
    isSuccess: isSuccessGetBusList,
    isError: isErrorGetBusList,
    error: errorGetBusList,
    isLoading: isLoadingGetBusList,
    data: busData,
  } = useQuery(['bus-details', id, date], getBusById);

  // console.log('busDatas',busData);

  const {
    mutateAsync: addBookingMutation,
    isSuccess: isSuccessAddBooking,
    isError: isErrorAddBooking,
    error: errorAddBooking,
    isLoading: isLoadingAddBooking,
    data: addBookResponse,
  } = useMutation(addBooking);



  useEffect(() => {
    updateSuccessStatus(addBookResponse?.success);
    if (addBookResponse && addBookResponse.success) {
      if (addBookResponse?.data?.status === 'reserved') {
        setSelectedSeat([...selectedSeat, addBookResponse.data]);
        updateNotification(addBookResponse.msg);
      }
      refetch();
    }
  }, [addBookResponse, isSuccessAddBooking]);

  const {
    mutateAsync: unSelectBookingMutation,
    isSuccess: isSuccessunSelectBooking,
    isError: isErrorunSelectBooking,
    error: errorunSelectBooking,
    isLoading: isLoadingunSelectBooking,
    data: unSelectBookResponse,
  } = useMutation(addBooking);

  useEffect(() => {
    updateSuccessStatus(unSelectBookResponse?.success);
    if (unSelectBookResponse && unSelectBookResponse.success) {
      setSelectedSeat(selectedSeat?.filter((seat: any) => seat._id !== currentSelectedSeat._id));
      updateNotification(unSelectBookResponse.msg);
      refetch();
    }
  }, [isSuccessunSelectBooking, unSelectBookResponse]);

  const bookingClickHandler = async () => {
    const { firstname, lastname, email, phone, dob, gender, reference_no } = formValue;


    if (payment_type === 'telebirr' && !reference_no) {
      console.log('Reference no is required');
      updateLocalError('Reference Number is Required.');
      setTimeout(() => {
        updateLocalError('');
      }, 3000);
    } else {
      toggleBooking(true);
      await addBookingMutation({
        bookingRecords: selectedSeat.map((seat: any) => ({
          ...seat,
          date: new Date(date),
          firstname,
          lastname,
          email,
          phone,
          dob,
          gender,
          bus_id: id,
          reference_no,
        })),
        bus_id: id,
        firstname,
        lastname,
        email,
        phone,
        dob,
        gender,
        date: new Date(date),
        payment_type,
        reference_no,
      });
    }
  };

  useEffect(() => {
    if (addBookResponse && addBookResponse.success && isBooking) {
      clearInterval(timerState);

      window.open(`https://www.mengedegna.com/ticket-details/${addBookResponse?.data?._id}/?lang=${locale}`, '_ blank');
      Router.push(`/dashboard/booking-management`);
    }
  }, [isSuccessAddBooking, addBookResponse]);

  const {
    mutateAsync: cancelBookingMutation,
    isSuccess: isSuccesscancelBooking,
    isError: isErrorcancelBooking,
    error: errorCancelBooking,
    isLoading: isLoadingcancelBooking,
    data: cancelBookResponse,
  } = useMutation(cancelBookingOnBackButton);

  useEffect(() => {
    if (timer === 0) {
      clearInterval(timerState);
      // cancelBookingsHandler();
      cancelBookinOnBackButtonHelper();
    }
  }, [timer]);

  const seatClickHandler = (position: string, column_id: string, row_id: string, seat_number: number) => {
    if (!timerState) {
      const timerState = setInterval(() => {
        updateTimer((timer) => timer - 1);
      }, 1000);
      setTimer(timerState);
    }
    updateFormValue({ ...formValue, position, column_id, row_id, seat_number });
    const selectOrUnselect = selectedSeat.find(
      (seat: any) => seat.position === position && seat.seat_number === seat_number,
    );
    if (selectOrUnselect) {
      setCurrentSeat(selectOrUnselect);
      unSelectBookingMutation({ ...selectOrUnselect, requestType: 'select' });
    } else {
      addBookingMutation({
        position,
        column_id,
        row_id,
        seat_number,
        bus_id: id,
        date: new Date(date),
        requestType: 'select',
      });
    }
  };

  useEffect(() => {
    if (unSelectBookResponse?.success || addBookResponse?.success) {
      setTimeout(() => { }, 200);
    }
  }, [unSelectBookResponse, isSuccessunSelectBooking || addBookResponse, isSuccessAddBooking]);

  const inputHandler = (key: string, value: any) => {
    updateFormValue({ ...formValue, [key]: value });
  };

  const handleContinueBooking = () => {
    toggleShowUser(!showUser);
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
    if (isSuccesscancelBookingOnBackButton) {
      Router.push('/dashboard/add-booking-management');
    }
  }, [isSuccesscancelBookingOnBackButton]);
  const cancelBookinOnBackButtonHelper = () => {
    cancelBookingOnBackButtonMutation({
      booking_id: selectedSeat.map((obj: any) => obj._id),
    });
  };

  const seletedSeatString = selectedSeat.map((seat: any, idx: number) => {
    let position = '';
    const seatNumber = seat.seat_number;
    switch (seat.position) {
      case 'cabin':
        position = 'C';
        break;
      case 'left':
        position = 'A';
        break;
      case 'right':
        position = 'B';
        break;
      case 'back':
        position = 'L';
        break;
      default:
    }
    return `${idx === 0 ? '' : ','} ${position}${seatNumber} `;
  });

  const totalAmount = busData?.data.price?.usd * selectedSeat.length;
  const totalAmountInEBT = busData?.data.price?.birr * selectedSeat.length;
  const totalAmountWithCommission = busData?.data?.display_price * selectedSeat.length;
  const routeName = `${busData?.data?.route_id?.from?.english?.location} - ${busData?.data?.route_id?.to?.english?.location}`;
  const commisionAmount = totalAmountWithCommission - totalAmountInEBT;
  useEffect(() => {
    router.beforePopState(({ as }) => {
      if (as !== router.asPath) {
        cancelBookingOnBackButtonMutation({
          booking_id: selectedSeat.map((obj: any) => obj._id),
        });
      }
      return true;
    });

    return () => {
      router.beforePopState(() => true);
    };
  }, [router, selectedSeat]); // Add any state variables to dependencies array if needed.

  useEffect(() => {
    window.onbeforeunload = function () {
      cancelBookingOnBackButtonMutation({
        booking_id: selectedSeat.map((obj: any) => obj._id),
      });
      return true;
    };

    return () => {
      window.onbeforeunload = null;
    };
  }, [selectedSeat]);

  const {
    isSuccess: isSuccessGetPayment,
    isError: isErrorPayment,
    error: paymentError,
    isLoading: isLoadingPayment,
    data: paymentData,
  } = useQuery(['payment-setting'], getAdminPaymentSettingDetails, {
    enabled: userInfo?.role === 'super-admin' || userInfo.role === 'admin',
  });


  const updateTheGender = (genderValue) => {
    updateGenderType(genderValue)
    inputHandler('gender', genderValue)
  }

  return (
    <div>
      <Paper className={classes.paperContainer}>
        <form action="" onSubmit={(e) => e.preventDefault()}>
          {showUser ? (
            <div className={classes.seatContainer}>
              <Box className={classes.seatWrapper}>
                <div
                  style={{ marginTop: 5, marginBottom: 20, width: '100%', display: 'flex', justifyContent: 'space-evenly' }}>
                  <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <MDSeat name="" type={seat} />
                    <p>{switchData.available}</p>
                  </Box>
                  <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <MDSeat name="" type={sold} />
                    <p>{switchData.booked} </p>
                  </Box>
                  <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <MDSeat name="" type={selected} />
                    <p>{switchData.selected} </p>
                  </Box>
                  <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <MDSeat name="" type={reserved} />
                    <p>{switchData.Reserved} </p>
                  </Box>
                </div>
                <div style={{ width: '100%' }}>
                  {busData && busData.data && (
                    <BusSeatLayout
                      formValue={busData.data.bus_type_id}
                      seatClickHandler={seatClickHandler}
                      bookingDetails={busData.data.booking_details}
                      selectedSeat={selectedSeat}
                    />
                  )}
                </div>
              </Box>
              {busData?.data?.route_id && (
                <Box className={classes.seatsAmountContainer}>
                  <Paper className={classes.seatAmountWrapper}>
                    <Typography gutterBottom>
                      <p>{routeName || ''}</p>
                    </Typography>
                    <Divider style={{ marginBottom: 20 }} />

                    <Box style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <p className={classes.pSeatAmount}>{switchData.seats} :</p>
                      <span>{seletedSeatString || ''}</span>
                    </Box>
                    {/* <Box style={{ display: 'flex', alignItems: 'center', marginTop: 15 }}>
                      <p className={classes.pSeatAmount}>{switchData.amount}($) :</p>
                      <span>{`${totalAmount || ''}`}</span>
                    </Box> */}
                    <Box style={{ display: 'flex', alignItems: 'center', marginTop: 15 }}>
                      <p className={classes.pSeatAmount}>{switchData.amount} :</p>

                      <span>
                        {totalAmountInEBT || ''} {switchData.etb}{' '}
                      </span>
                    </Box>
                    {(userInfo?.role === 'super-admin' || userInfo.role === 'admin') && (
                      <Box style={{ display: 'flex', alignItems: 'center', marginTop: 15 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '80%', minWidth: '70%' }}>
                          <p className={classes.aSeatAmount}>{switchData.commission} :</p>
                          <span style={{ fontSize: 10, fontStyle: 'italic' }}>Including Processing Charge</span>
                        </div>
                        <span>
                          {Math.floor(commisionAmount) || ''} {switchData.etb}
                        </span>
                      </Box>
                    )}
                    <div
                      style={{ marginTop: 20, marginBottom: 5, width: '100%', display: 'flex', justifyContent: 'center' }}>
                      <Button
                        disabled={selectedSeat.length === 0}
                        onClick={handleContinueBooking}
                        variant="contained"
                        color="primary">
                        {switchData.continue}
                      </Button>
                      <Link href="/dashboard/add-booking-management">
                        <Button
                          onClick={cancelBookinOnBackButtonHelper}
                          variant="contained"
                          color="secondary"
                          size="small"
                          style={{ marginLeft: 5 }}>
                          {switchData.back}
                        </Button>
                      </Link>
                    </div>
                  </Paper>
                </Box>
              )}
              {/* <div className={classes.btnContainer}>
                
              </div> */}
            </div>
          ) : (
            <div className={classes.passengerTraverlContainer}>
              <div className={classes.passengerTravelDetails}>
                <Paper className={classes.passengerContainer}>
                  <Box>
                    <Typography variant="h4" style={{ textTransform: 'uppercase', marginBottom: 20 }}>
                      {switchData.passengerDetails} :
                    </Typography>
                  </Box>
                  <Box className={classes.dsgnBox}>
                    <span className={classes.pBox}>{switchData.firstname}* :</span>

                    <TextField
                      // required 
                      placeholder="Enter First Name"
                      key={1}
                      variant="standard"
                      type="text"
                      size="small"
                      onChange={(e) => inputHandler('firstname', e.target.value)}
                    />
                  </Box>
                  <Box className={classes.dsgnBox}>
                    <p className={classes.pBox}>{switchData.lastname}* :</p>

                    <TextField
                      placeholder="Enter Last Name"
                      variant="standard"
                      type="text"
                      size="small"
                      // required
                      value={formValue.lastname}
                      onChange={(e) => inputHandler('lastname', e.target.value)}
                    />
                  </Box>
                  <div className={classes.dsgnBox}>
                    <p className={classes.pBoxPhone}>{switchData.phone}* :</p>
                    {/* <TextField
                      placeholder="Enter Number"
                      variant="standard"
                      type="tel"
                      size="small"
                      label="*"
                      required
                      onChange={(e) => inputHandler('phone', e.target.value)}
                    /> */}
                    <PhoneInput
                      masks={{ et: '.. ... ....' }}
                      country={'et'}
                      inputStyle={{ width: '200px' }}
                      inputProps={{
                        required: true,
                      }}
                      // style={{background:'red'}}
                      // value={formValue.phone}
                      onChange={(e) => inputHandler('phone', e)}
                    />
                  </div>
                  <Box className={classes.dsgnBox}>
                    <p className={classes.pBox}>{switchData.email}* :</p>
                    <TextField
                      placeholder="Enter Email"
                      variant="standard"
                      type="email"
                      size="small"
                      // required={userInfo.role === 'super-admin' || userInfo.role === 'admin' ? true : false}
                      onChange={(e) => inputHandler('email', e.target.value)}
                    />
                  </Box>
                  {/* gender */}
                  <Box className={classes.dsgnBox}>
                    <p className={classes.pBox}>{switchData.gender}* :</p>
                    <FormControl size="small" variant="standard" className={classes.formControl}>
                      <InputLabel id="demo-controlled-open-select-label" style={{ display: 'flex', alignItems: 'center' }}>
                        <p>- {switchData.choose} -</p>
                      </InputLabel>
                      <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        variant="standard"
                        value={gender_type}
                        onChange={(e: any) => updateTheGender(e.target.value)}
                        label="- choose -">
                        {genderType.map((obj: any) => (
                          <MenuItem key={obj.name} value={obj.value}>
                            {obj.name}
                          </MenuItem>
                        ))
                        }
                      </Select>
                    </FormControl>
                  </Box>

                  {/* age */}
                  <Box className={classes.dsgnBox}>
                    <p className={classes.pBox}>{switchData.age}* :</p>
                    <TextField
                      placeholder="Enter age"
                      variant="standard"
                      type="number"
                      size="small"
                      required
                      // required={userInfo.role === 'super-admin' || userInfo.role === 'admin' ? true : false}
                      onChange={(e) => inputHandler('dob', e.target.value)}
                    />
                  </Box>



                  {/* {!(userInfo?.role === 'super-admin' || userInfo.role === 'admin') && ( */}
                  <Box className={classes.dsgnBox}>
                    <p className={classes.pBox}>{switchData.paidBy} :</p>
                    <FormControl size="small" variant="standard" className={classes.formControl}>
                      <InputLabel id="demo-controlled-open-select-label" style={{ display: 'flex', alignItems: 'center' }}>
                        <p>- {switchData.choose} -</p>
                      </InputLabel>
                      <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        variant="standard"
                        required
                        value={payment_type}
                        onChange={(e: any) => updatePaymentType(e.target.value)}
                        label="- choose -">
                        {userInfo?.role === 'super-admin' || userInfo.role === 'admin'
                          ? paidType.slice(0, 1).map((obj: any) => (
                            <MenuItem key={obj.name} value={obj.value}>
                              {obj.name}
                            </MenuItem>
                          ))
                          : paidType.map((obj: any) => (
                            <MenuItem key={obj.name} value={obj.value}>
                              {obj.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Box>




                  {/* )} */}
                  {(payment_type === 'telebirr' || payment_type === 'cbe') && (
                    // !(userInfo?.role === 'super-admin' || userInfo.role === 'admin')
                    <Box className={classes.dsgnBox}>
                      <p className={classes.pBox}>{switchData.referenceNo}* :</p>
                      <TextField
                        placeholder="Enter reference no..."
                        variant="standard"
                        type="text"
                        size="small"
                        // required
                        onChange={(e) => inputHandler('reference_no', e.target.value)}
                      />
                    </Box>
                  )}
                </Paper>
                <Paper className={classes.travelContainer}>
                  <Typography gutterBottom variant="h4" style={{ textTransform: 'uppercase', marginBottom: 20 }}>
                    {switchData.travelDetails}
                  </Typography>
                  <Box style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                    <p className={classes.pTravel}>{switchData.route} :</p>
                    <span>{routeName}</span>
                  </Box>

                  <Box style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                    <p className={classes.pTravel}>{switchData.seats} :</p>
                    <span>{seletedSeatString}</span>
                  </Box>

                  <Typography
                    gutterBottom
                    variant="h4"
                    style={{ textTransform: 'uppercase', marginTop: 40, marginBottom: 20 }}>
                    {switchData.paymentDetails}
                  </Typography>
                  <Box style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                    <p style={{ width: '45%' }}>{switchData.perTicketCost} :</p>
                    {userInfo?.role === 'super-admin' || userInfo.role === 'admin' ?
                      <span>
                        {totalAmountInEBT || ''} {switchData.etb}
                      </span>
                      :
                      <span>
                        {busData?.data.price?.birr} {switchData.etb}
                      </span>
                    }

                    {/* <span>{`EBT.${busData?.data.price?.birr}`}</span> */}
                  </Box>
                  {userInfo?.role === 'super-admin' || userInfo.role === 'admin' ?
                    <Box style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                      <p style={{ width: '45%' }}>{switchData.commission} :</p>
                      <span>
                        {Math.floor(commisionAmount) || ''} {switchData.etb}
                      </span>
                    </Box>
                    : ''}

                  <Box style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                    <p style={{ width: '45%' }}>{switchData.totalCost} :</p>
                    {userInfo?.role === 'super-admin' || userInfo.role === 'admin' ?
                      <span>
                        {Math.floor(totalAmountWithCommission)} {switchData.etb}
                      </span>
                      :
                      <span>
                        {totalAmountInEBT} {switchData.etb}
                      </span>

                    }
                    {/* <span>{`EBT.${totalAmountInEBT}`}</span> */}
                  </Box>

                  <Box style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                    <Button
                      fullWidth
                      size="large"
                      disabled
                      style={{ border: '1px solid black', color: 'black' }}
                      variant="outlined"
                      color="primary">
                      {switchData.timeOut}
                      {` ${Math.floor(timer / 60)}:${timer % 60 ? timer % 60 : '00'}`}
                    </Button>
                  </Box>

                  {(userInfo?.role === 'super-admin' || userInfo.role === 'admin') && (
                    <Box style={{ display: 'flex', alignItems: 'center', marginTop: 30 }}>
                      <h3 style={{ width: '45%', color: 'green' }}>{switchData.accountNumber} :</h3>
                      <h3 style={{ color: 'green' }}>{paymentData?.data?.[0]?.telebirr_account}</h3>
                      {/* <span></span> */}
                    </Box>
                  )}
                </Paper>
              </div>

              <div className={classes.emailTicketContainer}>
                <Button onClick={() => bookingClickHandler()} type="submit" size="medium" variant="contained" color="primary">
                  {switchData.confirmTicket}
                </Button>
                <Button
                  onClick={handleContinueBooking}
                  variant="contained"
                  size="medium"
                  color="secondary"
                  style={{ marginLeft: 5 }}>
                  {switchData.cancel}
                </Button>
              </div>
            </div>
          )}
        </form>
        <NotificationLoader
          message={successStatus && notification}
          loading={isLoadingunSelectBooking || isLoadingAddBooking || isLoadingcancelBookingOnBackButton}
          error={
            (!successStatus && (JSON.stringify(unSelectBookResponse?.errors) || JSON.stringify(addBookResponse?.errors))) ||
            (!successStatus && localError)
          }
        />
      </Paper>
    </div>
  );
}
