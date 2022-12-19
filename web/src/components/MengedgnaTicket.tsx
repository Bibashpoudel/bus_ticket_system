import { Button, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect } from 'react';
import ReactToPrint from 'react-to-print';
import { useQuery } from 'react-query';
import { getTicketDetails } from '../apis/upload-receipt';
import { NotificationLoader } from '../../@jumbo/components/ContentLoader';
import IntlMessages from '../../@jumbo/utils/IntlMessages';
import moment from 'moment';
import LanguageSwitcher from '../../@jumbo/components/AppLayout/partials/LanguageSwitcher';
import Router from 'next/router';
var ethiopianDate = require('ethiopian-date');

const switchData = {
  mengedgnaTicket: <IntlMessages id={'mengedgnaTicket'} />,
  from: <IntlMessages id={'from'} />,
  to: <IntlMessages id={'to'} />,
  print: <IntlMessages id={'print'} />,
  arrivaltime: <IntlMessages id={'arrivaltime'} />,
  departuretime: <IntlMessages id={'departuretime'} />,
  busName: <IntlMessages id={'busName'} />,
  bookingDate: <IntlMessages id={'bookingDate'} />,
  busnumberplate: <IntlMessages id={'busnumberplate'} />,
  price: <IntlMessages id={'price'} />,
  seat: <IntlMessages id={'seat'} />,
  name: <IntlMessages id={'name'} />,
  phone: <IntlMessages id={'phone'} />,
  email: <IntlMessages id={'email'} />,
  cancel: <IntlMessages id={'cancel'} />,
  paymentMode: <IntlMessages id={'paymentMode'} />,
  status: <IntlMessages id={'status'} />,
  ticketNo: <IntlMessages id={'ticketNo'} />,
};

const useStyles = makeStyles((theme) => ({
  wrapper: {
    // height:'100vh',
    // marginTop: 50,
    width: '100vw',
    display: 'flex',
    padding: 50,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  langContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  paper: {
    padding: 20,
    minWidth: '80%',
    // minHeight:300,
    // background:'yellow'
  },
  logoDetailsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    // background:'blue',
    [theme.breakpoints.down('sm')]: {
      // justifyContent:'none'
    },
  },
  logoContainer: {
    width: '20%',
    display: 'flex',
    flexDirection: 'column',
    // marginRight:5,
    // background:'green',
    // justifyContent:'space-around'
  },
  detailsContainer: {
    width: '79%',
    // background: 'red',
  },
  lContainer: {
    width: '53%',
    display: 'flex',
    alignItems: 'center',
    // background:'red',
  },

  rContainer: {
    width: '45%',
    display: 'flex',
    alignItems: 'center',
    // background:'green'
  },
  title: {
    display: 'flex',
    paddingLeft: 200,
    // justifyContent: 'center',
    marginBottom: 15,
  },
  pDiv: {
    width: '40%',
    // background:'red',
    // marginRight:15
  },
  plDiv: {
    width: '45%',
    // background:'green',
    // marginRight:15
  },
  lrContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    minHeight: 35,
    lineHeight: '0.43px',
    // background:'red'
  },
}));

export default function MangedgnaTicket(props: any) {
  const { params, query } = props;

  const classes = useStyles();
  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef<(() => void) | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [printState, togglePrintState] = React.useState(false);
  const [text, setText] = React.useState('Some cool text from the parent');
  const [ticketDetails, updateTicketDetails] = React.useState({} as any);

  const {
    refetch,
    isSuccess: isSuccessGetTicketDetails,
    isError: isErrorTicketDetails,
    error: TicketDetailsError,
    isLoading: isLoadingTicketDetails,
    data: ticketDetailsData,
  } = useQuery(['TicketIdDetails', params?.ticket_id], getTicketDetails);

  // console.log('Ticket-id-details', ticketDetailsData);

  useEffect(() => {
    if (ticketDetailsData && ticketDetailsData?.data) {
      const { booking_id, bus_id, _id, read_ticket_id } = ticketDetailsData.data;
      const { created_at, date, email, firstname, isPaid, lastname, payment_id, phone } = booking_id[0] || {};
      const { amount, currency, discount_code, isSettled, payment_type, reference_number } = payment_id;
      const { english: busDetails, route_id: routeDetails, arrival, departure } = bus_id;

      updateTicketDetails({
        created_at,
        date,
        email,
        firstname,
        isPaid,
        lastname,
        phone,
        amount,
        _id,
        currency,
        discount_code,
        isSettled,
        payment_type,
        busDetails,
        routeDetails,
        arrival,
        departure,
        read_ticket_id,
      });
    }
  }, [isSuccessGetTicketDetails, ticketDetailsData]);

  const selectedSeatString = ticketDetailsData?.data?.booking_id?.map((seat: any, idx: number) => {
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

  const handleAfterPrint = React.useCallback(() => {
    console.log('`onAfterPrint` called'); // tslint:disable-line no-console
    togglePrintState(false);
  }, []);

  const handleBeforePrint = React.useCallback(() => {
    console.log('`onBeforePrint` called'); // tslint:disable-line no-console
  }, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
    console.log('`onBeforeGetContent` called'); // tslint:disable-line no-console
    setLoading(true);
    setText('Loading new text...');
    togglePrintState(true);
    return new Promise<void>((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        setLoading(false);
        setText('New, Updated Text!');
        resolve();
      }, 10);
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
      <Button variant="contained" color="primary">
        {switchData.print}
      </Button>
    );
  }, []);
  let displayEthoDate;
  let displayEngDate;
  if (ticketDetails) {
    let bookingdate = ticketDetails.date;

    displayEngDate = moment(bookingdate).format('DD MMM YYYY');

    const bMonths = bookingdate?.split('-')[1];
    let ethodate;
    const months = moment(bMonths, 'mm').format('m');
    const days = bookingdate?.split('-')[2];

    const fDay = days ? days[0] : 0;
    let day;
    if (days) {
      if (fDay === '0') {
        day = days[1];
      } else {
        day = days;
      }
    }

    if (bookingdate) {
      ethodate = ethiopianDate.toEthiopian(bookingdate?.split('-')[0], parseInt(months), parseInt(day));
    }
    const eYear = ethodate ? ethodate[0] : 0;
    const eMonth = ethodate ? ethodate[1] : 0;
    const eDay = ethodate ? ethodate[2] : 0;
    const date = new Date(`${eYear}/${eMonth}/${eDay}`);

    displayEthoDate = moment(date).format('D/MM/YYYY');
  }

  const languageUpdate = (lgValue: any) => {
    Router.push({
      pathname: `/ticket-details/${params.ticket_id}`,
      query: { lang: lgValue },
    });
  }

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.paper}>
        <div className={classes.langContainer}>
          <LanguageSwitcher langSwitch={query.lang} defaultStatus={true} onUpdateLang={(langValue: any) => languageUpdate(langValue)} />
        </div>



        <div className={classes.logoDetailsContainer} ref={componentRef}>

          <div className={classes.logoContainer}>
            <div>
              <img style={{ width: '100%' }} src="/images/logos/english.png" alt="" />
            </div>
            <div>
              {/* <img style={{ width: '100%' }} src="/images/qr.png" alt="" /> */}
              <img
                src={`https://chart.googleapis.com/chart?cht=qr&chl=${ticketDetails?.read_ticket_id}&chs=160x160&chld=L|0`}
              />
            </div>
          </div>
          <div className={classes.detailsContainer}>
            <div className={classes.title}>
              <h2>{switchData.mengedgnaTicket} </h2>
            </div>


            <div className={classes.lrContainer}>
              <div className={classes.lContainer}>
                <p className={classes.plDiv}>{switchData.ticketNo} : </p>
                <span>
                  {/* Addis Ababa */}
                  {ticketDetails?.read_ticket_id}
                </span>
              </div>
            </div>

            <div className={classes.lrContainer}>
              <div className={classes.lContainer}>
                <p className={classes.plDiv}>{switchData.from} : </p>
                <span>
                  {/* Addis Ababa */}
                  {ticketDetails?.routeDetails?.from?.english?.location}
                </span>
              </div>
              <div className={classes.rContainer}>
                <p className={classes.pDiv}>{switchData.to} : </p>
                <span> {ticketDetails?.routeDetails?.to?.english?.location}</span>
              </div>
            </div>

            <div className={classes.lrContainer}>
              <div className={classes.lContainer}>
                <p className={classes.plDiv}>{switchData.departuretime} : </p>
                <span>{ticketDetails.departure}</span>
              </div>
              <div className={classes.rContainer}>
                <p className={classes.pDiv}>{switchData.arrivaltime} : </p>
                <span>{ticketDetails.arrival}</span>
              </div>
            </div>

            <div className={classes.lrContainer}>
              <div className={classes.lContainer}>
                <p className={classes.plDiv}>{switchData.busName} : </p>
                <span> {ticketDetails?.busDetails?.name}</span>
              </div>
              <div className={classes.rContainer}>
                <p className={classes.pDiv}>{switchData.bookingDate} : </p>
                {/* <span>{`${displayEngDate ? displayEngDate : ''} (${displayEthoDate ? displayEthoDate : ''})`}</span> */}
                <span>{`${displayEngDate ? displayEngDate : ''}`} {moment(ticketDetails.date).format('D/MM/YYYY')}</span>
                
              </div>
            </div>

            <div className={classes.lrContainer}>
              <div className={classes.lContainer}>
                <p className={classes.plDiv}>{switchData.busnumberplate} : </p>
                <span>{ticketDetails?.busDetails?.plate_number}</span>
              </div>
              <div className={classes.rContainer}>
                <p className={classes.pDiv}>{switchData.seat} : </p>
                <span>{selectedSeatString}</span>
              </div>
            </div>

            <div className={classes.lrContainer}>
              <div className={classes.lContainer}>
                <p className={classes.plDiv}>{switchData.price} : </p>
                <span>{ticketDetails?.amount} ETB</span>
              </div>
              <div className={classes.rContainer}>
                <p className={classes.pDiv}>{switchData.paymentMode} : </p>
                <span>{ticketDetails?.payment_type}</span>
              </div>
            </div>

            <div className={classes.lrContainer}>
              <div className={classes.lContainer}>
                <p className={classes.plDiv}>{switchData.name} : </p>
                <span>{`${ticketDetails?.firstname} ${ticketDetails?.lastname}`}</span>
              </div>
              <div className={classes.rContainer}>
                <p className={classes.pDiv}>{switchData.email} : </p>
                <span>{ticketDetails?.email}</span>
              </div>
            </div>

            <div className={classes.lrContainer}>
              <div className={classes.lContainer}>
                <p className={classes.plDiv}>{switchData.phone} : </p>
                <span>{ticketDetails?.phone?.substring(0, 4)}</span>&nbsp;<span> {ticketDetails?.phone?.substring(4, 6)}</span>  &nbsp;<span> {ticketDetails?.phone?.substring(6, 9)}</span> &nbsp;<span> {ticketDetails?.phone?.substring(9)}</span>
              </div>
              <div className={classes.rContainer}>
                <p className={classes.pDiv}>{switchData.status} : </p>
                <span>{ticketDetails?.isPaid ? 'Paid' : 'Unpaid'}</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 10 }}>{/* <h4>62cbc23e32c73e0d51df135e</h4> */}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {/* <Button style={{ marginRight: 5 }} variant="contained" color="secondary">
            {switchData.cancel}
          </Button> */}
          {/* <div ref={componentRef}>
            <h1>this for test prints</h1>
          </div> */}
          <ReactToPrint
            content={reactToPrintContent}
            documentTitle="AwesomeFileName"
            onAfterPrint={handleAfterPrint}
            onBeforeGetContent={handleOnBeforeGetContent}
            onBeforePrint={handleBeforePrint}
            removeAfterPrint
            trigger={reactToPrintTrigger}
          />
        </div>
        <NotificationLoader message={''} loading={isLoadingTicketDetails} error={''} />
      </Paper>
    </div>
  );
}
