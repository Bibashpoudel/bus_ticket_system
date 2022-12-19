import { Button, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { format } from 'date-fns';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import ReactToPrint from 'react-to-print';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { getBusById } from '../../apis/booking/booking';
import { getTransactionList } from '../../apis/finance/finance';
import TransactionTable from './TransactionTable';

const switchData = {
  printTransaction: <IntlMessages id={'printTransaction'} />,
  total: <IntlMessages id={'total'} />,
  date: <IntlMessages id={'date'} />,
  totalAmountToBePaid: <IntlMessages id={'totalAmountToBePaid'} />,
  totalFromOnline: <IntlMessages id={'totalFromOnline'} />,
  totalProcessingFee: <IntlMessages id={'totalProcessingFee'} />,
  totalAppFee: <IntlMessages id={'totalAppFee'} />,
  totalDiscount: <IntlMessages id={'totalDiscount'} />,
  etb: <IntlMessages id={'etb'} />
};

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    padding: 30,
    [theme.breakpoints.down('sm')]: {
      padding: 20,
    },
  },
}));

export default function MDTransaction(props: any) {
  const { params } = props;
  const [bus_id, date] = params.ids;
  const classes = useStyles();
  const [formatedList, setFormatedData] = useState([]);
  const [pageInfo, updatePageInfo] = useState({ page: 1, size: 10 });

  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef<(() => void) | null>(null);

  const {
    data: busListById,
    refetch: busListRefetch,
    isPreviousData: busListPrevious,
    isLoading: isbusListLoading,
    isSuccess: isSuccessBusList,
    remove: removeBusList,
  } = useQuery(['bus-details', bus_id, ''], getBusById);

  const {
    data: transactionList,
    refetch,
    isPreviousData,
    isLoading: istransactionListLoading,
    isSuccess,
    remove,
  } = useQuery(['transaction-list', bus_id, date, pageInfo?.page, pageInfo.size], getTransactionList);

  const getSeatName = (obj: any) => {
    console.log('get bus name', obj);
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
    if (transactionList && transactionList.success) {
      const formatedData = transactionList?.data?.data?.map((p: any, idx: number) => ({
        ...p,
        passenger: `${p?.booking_id[0]?.firstname} ${p?.booking_id[0]?.lastname}`,
        payment_method: p?.payment_type,

        transaction_date: format(new Date(p?.created_at), 'yyyy-MM-dd'),
        seats: `${p?.booking_id.length} (${p?.booking_id
          ?.reduce((t: any, s: any) => {
            t = `${t}${getSeatName(s)},`;
            return t;
          }, '')
          .slice(0, -1)})`,
        ticket: p?.booking_id[0]?.ticketed_by,
        status: p?.isSettled ? 'settled' : <Link href="#">unsettled</Link>,
      }));
      setFormatedData(formatedData);
    }
  }, [isSuccess, transactionList]);

  const pageNoHandler = (type: string, value: any) => {
    if (type === 'page') {
      updatePageInfo({ ...pageInfo, [type]: value + 1 });
    } else {
      updatePageInfo({ ...pageInfo, [type]: value });
    }
  };

  const [loading, setLoading] = React.useState(false);
  const [printState, togglePrintState] = React.useState(false);
  const [text, setText] = React.useState('Some cool text from the parent');

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
      <Button variant="contained" color="primary">
        {switchData.printTransaction}
      </Button>
    );
  }, []);

  const [userInfo, setUserInfo] = useState({} as any);

  useEffect(() => {
    const userData = sessionStorage.getItem('user') || '';
    if (userData) {
      setUserInfo(JSON.parse(userData)?.user);
    }
  }, []);

  return (
    <div>
      <Paper className={classes.paperContainer}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <p>
              {busListById?.data?.english.name}({busListById?.data?.english.bus_number})
            </p>
            <p>
              {busListById?.data?.route_id?.from.english.location}-{busListById?.data?.route_id?.to.english.location}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* <span>{`Date: ${date}`}</span> */}
            <span>
              {' '}
              {switchData.date}: {date}
            </span>
            <span>
              {userInfo.role === 'super-admin' || userInfo.role === 'admin'
                ? switchData.totalAmountToBePaid
                : switchData.totalFromOnline}{' '}
              : <span>{Math.floor(transactionList?.data?.totalAmount)} {switchData.etb}</span> 
            </span>

            <div style={{ display: 'felx', flexDirection: 'column' }}>
              {(userInfo.role === 'super-admin' || userInfo.role === 'admin') && (
                <div>
                  <span>
                    {userInfo.role === 'super-admin' || userInfo.role === 'admin'
                      ? switchData.totalAppFee
                      : switchData.total}{' '}
                    : <span>{Math.floor(transactionList?.data?.totalComission)} {switchData.etb} </span>
                  </span>
                </div>
              )}
              {(userInfo.role === 'super-admin' || userInfo.role === 'admin') && (
                <div>
                  <span>
                    {userInfo.role === 'super-admin' || userInfo.role === 'admin'
                      ? switchData.totalProcessingFee
                      : switchData.total}{' '}
                    : <span>{Math.floor(transactionList?.data?.totalProcessing)} {switchData.etb} </span>
                  </span>
                </div>
              )}
              <span>
                {switchData.totalDiscount}: <span>{Math.floor(transactionList?.data?.totalDiscount)} {switchData.etb} </span>
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 10 }}>
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
        <div ref={componentRef}>
          <TransactionTable data={formatedList} loading={istransactionListLoading} pageHandler={pageNoHandler} />
        </div>
      </Paper>
    </div>
  );
}
