import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Link, Modal, Paper, TextareaAutosize, TextField, Typography } from '@material-ui/core';
import { useMutation, useQuery } from 'react-query';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { getTicketDetails, updateVerify, declineReciept } from '../apis/upload-receipt';
import IntlMessages from '../../@jumbo/utils/IntlMessages';
import { NotificationLoader } from '../../@jumbo/components/ContentLoader';
import Router from 'next/router';
import PDFViewer from 'pdf-viewer-reactjs';

// Language Switching data========
const switchData = {
  busNumber: <IntlMessages id={'busNumber'} />,
  amount: <IntlMessages id={'amount'} />,
  seatNumber: <IntlMessages id={'seatNumber'} />,
  bankName: <IntlMessages id={'bankName'} />,
  refrenceNo: <IntlMessages id={'refrenceNo'} />,
  receipt: <IntlMessages id={'receipt'} />,
  verify: <IntlMessages id={'verify'} />,
  decline: <IntlMessages id={'decline'} />,
  verifyReceiptDtails: <IntlMessages id={'verifyReceiptDtails'} />,

  cancel: <IntlMessages id={'cancel'} />,
  confirmDecline: <IntlMessages id={'confirmDecline'} />,
};

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

const useStyles = makeStyles((theme) => ({
  paperWrapper: {
    display: 'flex',
    justifyContent: 'center',
    // alignItems:'center',
    // height:'100vh',
    width: '100vw',
  },
  paperContainer: {
    padding: 30,
    // width:'80%',
    // marginTop:50,
    [theme.breakpoints.down('sm')]: {
      marginTop: 20,
      // width:'90%',
      padding: 15,
    },
  },
  selectFormControl: {
    minWidth: '27%',
    [theme.breakpoints.down('sm')]: {
      minWidth: '65%',
    },
  },
  labelTextFieldContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 20,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 10,
    },
  },
  uploadFileContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 20,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  pTag: {
    width: '16%',
    [theme.breakpoints.down('sm')]: {
      width: '35%',
    },
  },
  pTagOfUploadFile: {
    width: '16%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  textField: {
    width: '27%',
    [theme.breakpoints.down('sm')]: {
      width: '65%',
    },
  },
  uploadFileTextField: {
    width: '27%',
    [theme.breakpoints.down('sm')]: {
      width: '80%',
    },
  },
  btnContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      marginTop: 15,
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
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function VerifyReceipt(props: any) {
  const classes = useStyles();
  const [userInfo, setUserInfo] = useState({} as any);
  const [modalStyle] = React.useState(getModalStyle);
  const { params } = props;
  const [open, toggleModal] = useState<any>(false);

  const {
    mutateAsync: mutateAsyncDecline,
    isSuccess: isSuccessDecline,
    isError: isErrorDecline,
    error: declineError,
    isLoading: isLoadingDecline,
    data: declineData,
  } = useMutation(declineReciept);

  // const declineHandler = (obj: any) => {
  //   mutateAsyncDecline({
  //     message,
  //     ticket_id: params?.id,
  //   });
  // };

  useEffect(() => {
    if (declineData && declineData?.success) {
      setTimeout(() => {
        Router.push('/dashboard/booking-management');
      }, 200);
    } else if (isErrorDecline) {
      console.log('...............i am error', declineError)
    }
  }, [isSuccessDecline, declineData, isErrorDecline, declineError]);

  const toggleModalHandler = () => {
    toggleModal(!open);
  };

  useEffect(() => {
    const userData = sessionStorage.getItem('user') || '';
    if (userData) {
      setUserInfo(JSON.parse(userData)?.user);
    }
  }, []);

  const {
    refetch,
    isSuccess: isSuccessGetTicketDetails,
    isError: isErrorTicketDetails,
    error: TicketDetailsError,
    isLoading: isLoadingTicketDetails,
    data: TicketDetailsData,
  } = useQuery(['TicketIdDetails', params?.id], getTicketDetails);
  console.log('Ticket-id-details', TicketDetailsData);

  const {
    mutateAsync: mutateAsyncUpdateVerify,
    isSuccess: isSuccessUpdteVerify,
    isError: isErrorUpdateVerify,
    error: updateVerifyError,
    isLoading: isLoadingUpdateVerify,
    data: updateVerifyData,
  } = useMutation(updateVerify);

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
    if (updateVerifyData?.success) {
      setTimeout(() => {
        Router.push('/dashboard/booking-management');
      }, 200);
    }
  }, [isSuccessUpdteVerify]);

  const verifyHandler = () => {
    const bus_id = TicketDetailsData?.data?.bus_id?._id;
    console.log('bus_id', bus_id);
    if (params?.id) {
      mutateAsyncUpdateVerify({ ...params, bus_id });
    }
  };

  let seatName = TicketDetailsData?.data?.booking_id
    .map((obj: any) => ({ ...obj, sname: getSeatName(obj) }))
    .reduce((t: string, s: any) => {
      t = `${t}${s.sname},`;
      return t;
    }, '');

  seatName = `${TicketDetailsData?.data?.booking_id?.length} (${seatName?.slice(0, -1)})`;
  console.log('Seat name', seatName);

  const getFileExtension = (filename: string) => {
    // get file extension

    const extension = filename?.split('.')?.pop();

    return extension;
  };

  const MessageSchema = Yup.object().shape({
    message: Yup.string().required('Decline field required'),
  });

  const formik = useFormik({
    initialValues: {
      message: '',

    },
    validationSchema: MessageSchema,
    onSubmit: async (values) => {
      mutateAsyncDecline({
        message: values.message,
        ticket_id: params?.id,
      });
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <div>
      <Paper className={classes.paperContainer}>
        <Typography gutterBottom variant="h2" style={{ marginBottom: 40 }}>
          {switchData.verifyReceiptDtails}
        </Typography>
        <div className={classes.labelTextFieldContainer}>
          <p className={classes.pTag}>{switchData.busNumber} :</p>
          <span>{`${TicketDetailsData?.data?.bus_id?.english?.name}(${TicketDetailsData?.data?.bus_id?.english?.bus_number})`}</span>
        </div>
        <div className={classes.labelTextFieldContainer}>
          <p className={classes.pTag}>{switchData.seatNumber} :</p>
          <span>{seatName}</span>
        </div>
        {TicketDetailsData?.data?.booking_id[0]?.payment_id?.currency === 'usd' && (
          <div className={classes.labelTextFieldContainer}>
            <p className={classes.pTag}>{switchData.amount}($) :</p>
            <span> {TicketDetailsData?.data?.booking_id[0]?.payment_id?.amount}</span>
          </div>
        )}
        {TicketDetailsData?.data?.booking_id[0]?.payment_id?.currency === 'birr' && (
          <div className={classes.labelTextFieldContainer}>
            <p className={classes.pTag}>{switchData.amount}(ETB) :</p>
            <span> {TicketDetailsData?.data?.booking_id[0]?.payment_id?.amount}</span>
          </div>
        )}
        {/* <div className={classes.labelTextFieldContainer}>
          <p className={classes.pTag}>{switchData.bankName} :</p>
          <span> {TicketDetailsData?.data?.booking_id[0]?.payment_id?.payment_gateway} </span>
        </div> */}
        <div className={classes.labelTextFieldContainer}>
          <p className={classes.pTag}>{switchData.refrenceNo} :</p>
          <span>{TicketDetailsData?.data?.booking_id[0]?.payment_id?.reference_number}</span>
        </div>
        {/* <div className={classes.uploadFileContainer}>
          <p className={classes.pTagOfUploadFile}>{switchData.receipt} :</p>
        </div>
        <div style={{ height: 'auto', width: 'auto' }}>
          {getFileExtension(TicketDetailsData?.data?.booking_id[0]?.payment_id?.receipt) === 'pdf' ? (
            <PDFViewer
              document={{
                url: `https://stage.mengedegna.com/${TicketDetailsData?.data?.booking_id[0]?.payment_id?.receipt}`,
              }}
            />
          ) : (
            <img
              src={`https://stage.mengedegna.com/${TicketDetailsData?.data?.booking_id[0]?.payment_id?.receipt}`}
              alt=""
            />
          )}
        </div> */}
        <div className={classes.btnContainer}>
          <Button onClick={verifyHandler} variant="contained" color="primary">
            {switchData.verify}
          </Button>

          <Button onClick={toggleModalHandler} variant="contained" color="secondary" style={{ marginLeft: 5 }}>
            {switchData.decline}
          </Button>
        </div>
        <NotificationLoader
          message={(updateVerifyData?.success && updateVerifyData?.msg) || (declineData?.success && declineData?.msg)}
          loading={isLoadingUpdateVerify || isLoadingDecline}
          error={JSON.stringify(updateVerifyData?.errors) || JSON.stringify(declineData?.errors)}
        />
        <Modal
          keepMounted
          open={open}
          // onClose={modalCloseHandler}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description">
          <div style={{ ...modalStyle, height: 250 }} className={classes.paper}>
            {/* <h4>{switchData.areYouSureYouWantToDelete}</h4> */}
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <TextareaAutosize
                  aria-label="minimum height"
                  minRows={6}
                  {...getFieldProps('message')}
                  // error={Boolean(touched.message && errors.message)}
                  // helperText={touched.message && errors.message}
                  // onChange={(e) => updateMessage(e.target.value)}
                  placeholder="Type decline reason here..."
                  style={{ width: '100%', height: 150, outline: 'none', padding: 5 }}
                />
                <div style={{ color: '#ff0000' }} >{touched.message && errors.message}</div>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                  {/* <Link href="/dashboard/booking-management"> */}
                  <Button type="submit" style={{ marginRight: 5 }} variant="contained" color="primary" size="small">
                    {switchData.confirmDecline}
                  </Button>


                  {/* </Link> */}
                  <Button onClick={toggleModalHandler} variant="contained" color="secondary" size="small">
                    {switchData.cancel}
                  </Button>
                </div>
              </Form>
            </FormikProvider>
          </div>
        </Modal>
      </Paper>
    </div>
  );
}
