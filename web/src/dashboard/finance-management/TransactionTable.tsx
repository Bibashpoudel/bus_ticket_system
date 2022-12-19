import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import GrdTable from '../../components/MDGridTable';
import Link from 'next/link';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';

// Language Switching data========
const switchData = {
  back: <IntlMessages id={'back'} />,
  filterName: <IntlMessages id={'filterbyname'} />,
  choose: <IntlMessages id={'choose'} />,
  search: <IntlMessages id={'search'} />,
  edit: <IntlMessages id={'edit'} />,
  delete: <IntlMessages id={'delete'} />,
  routes: <IntlMessages id={'routes'} />,
  ticketNo: <IntlMessages id={'ticketNo'} />,
  etb: <IntlMessages id={'etb'} />
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
  { key: 'passenger', label: <IntlMessages id={'passenger'} /> },
  // { key: 'transaction_date', label: <IntlMessages id={'transactionDate'} /> },
  { key: 'payment_method', label: <IntlMessages id={'paymentMethod'} /> },
  { key: 'seats', label: <IntlMessages id={'numberOfSeats'} /> },
  { key: 'amount', label: <IntlMessages id={'amountPaid'} /> },
  { key: 'bus_fee', label: <IntlMessages id={'busFee'} /> },
  { key: 'comission', label: <IntlMessages id={'appFee'} /> },
  { key: 'processing', label: <IntlMessages id={'processingFee'} /> },
  { key: 'discount', label: <IntlMessages id={'discount'} /> },
  { key: 'ticket', label: <IntlMessages id={'ticket'} /> },
  // { key: 'status', label: <IntlMessages id={'status'} /> },
];

export default function MDBookingManagement(props: any) {
  const { data, loading, pageHandler } = props;
  const [userInfo, setUserInfo] = useState({} as any);

  useEffect(() => {
    const userData = sessionStorage.getItem('user') || '';
    if (userData) {
      setUserInfo(JSON.parse(userData)?.user);
    }
  }, []);

  return (
    <div>
      <GrdTable
        headCells={
          userInfo.role === 'super-admin' || userInfo.role === 'admin'
            ? headCells
            : headCells.filter((a) => a.key !== 'amount' && a.key !== 'comission' && a.key !== 'processing')
        }
        pageNoHandler={pageHandler}
        totalRecordCount={data?.totaldata}
        loading={loading}
        rows={
          data
            ? data?.map((r: any) => {
                return {
                  ...r,
                  amount: r.currency === 'birr' ? <span>{r?.amount} {switchData.etb}</span> : `${r.amount} USD`,
                  bus_fee: <span>{r.bus_fee} {switchData.etb} </span> ,
                  payment_method: r?.payment_method === 'card' ? 'paypal' : r.payment_method,
                  read_ticket_id: r?.ticket_id?.read_ticket_id,
                  comission: <span>{r.comission} {switchData.etb} </span>,
                  processing: <span>{r.processing} {switchData.etb} </span>,
                  discount: <span>{r.discount || 0} {switchData.etb} </span>,
                };
              })
            : []
        }
      />
      <div>
        <Link href="/dashboard/finance-management">
          <Button variant="contained" color="primary">
            {switchData.back}
          </Button>
        </Link>
      </div>
    </div>
  );
}
