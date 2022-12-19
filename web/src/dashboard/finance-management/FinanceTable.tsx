import { Button, Checkbox } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import GrdTable from '../../components/MDGridTable';
import Link from 'next/link';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { useIntl } from 'react-intl';

// Language Switching data========
const switchData = {
  transaction: <IntlMessages id={'transaction'} />,
  filterName: <IntlMessages id={'filterbyname'} />,
  choose: <IntlMessages id={'choose'} />,
  search: <IntlMessages id={'search'} />,
  edit: <IntlMessages id={'edit'} />,
  delete: <IntlMessages id={'delete'} />,
  routes: <IntlMessages id={'routes'} />,
  transfer: <IntlMessages id={'transfer'} />,
  etb: <IntlMessages id={'etb'} />,
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
  { key: 'bus', label: <IntlMessages id={'bus'} /> },
  { key: 'date', label: <IntlMessages id={'date'} /> },
  { key: 'totalticket', label: <IntlMessages id={'totalticket'} /> },
  { key: 'totalCollection', label: <IntlMessages id={'totalCollection'} /> },
  { key: 'busFee', label: <IntlMessages id={'busFee'} /> },
  { key: 'processing_charge', label: <IntlMessages id={'processingCharge'} /> },
  { key: 'app_commission', label: <IntlMessages id={'appCommission'} /> },
  { key: 'status', label: <IntlMessages id={'status'} /> },
  { key: 'action', label: <IntlMessages id={'action'} /> },
];

export default function MDFiananceManagement(props: any) {
  const { data, loading, pageHandler, tableData, isTransferred, transferCheckHandler } = props;

  const { dataBusList, selectedDate } = props;
  const { locale } = useIntl();

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
            ? headCells.filter((a) => a.key !== 'status')
            : headCells.filter(
                (a) => a.key !== 'processing_charge' && a.key !== 'app_commission' && a.key !== 'totalCollection',
              )
        }
        pageNoHandler={pageHandler}
        totalRecordCount={data?.totaldata}
        loading={loading}
        paginationHide={true}
        rows={
          data
            ? data.map((r: any, idx: number) => {
                console.log('Dataharu', r);
                return {
                  ...r,
                  totalticket: r.totalTicket,
                  totalCollection: (
                    <span>
                      {r?.total_income} {switchData.etb}{' '}
                    </span>
                  ),
                  // bus: r?.bus_details?.[locale]?.bus_number,
                  bus:
                    userInfo.role === 'super-admin' || userInfo.role === 'admin'
                      ? `${r?.bus_details?.[locale]?.name}(${r?.bus_details?.[locale].bus_number})`
                      : `${r?.bus_details?.[locale]?.plate_number}(${r?.bus_details?.[locale].bus_number})`,
                  departure: `${r.departure}`,
                  arrival: `${new Date(r.arrival).getHours()}:${new Date(r.arrival).getMinutes()}`,
                  route: `${r.route_id?.from?.[locale]?.location}-${r.route_id?.to?.[locale]?.location}`,
                  busFee: (
                    <span>
                      {r.collection} {switchData.etb}
                    </span>
                  ),
                  processing_charge: (
                    <span>
                      {r.processing_charge} {switchData.etb}{' '}
                    </span>
                  ),
                  app_commission: (
                    <span>
                      {r.app_commission} {switchData.etb}{' '}
                    </span>
                  ),
                  action: [
                    <Link key={1} href={`/dashboard/transaction/${r.bus_details?._id}/${r.date}`}>
                      <Button key={1} variant="contained" color="primary" style={{ minWidth: '152px' }}>
                        {switchData.transaction}
                      </Button>
                    </Link>,
                    (userInfo.role === 'super-admin' || userInfo.role === 'admin') && r.collection > 0 && (
                      <div>
                        <Checkbox
                          key={r?.bus_details?._id}
                          checked={r?.financeReportStatus?.isSettle}
                          value={r?.financeReportStatus?._id}
                          color="primary"
                          onChange={(e) => transferCheckHandler(r, e)}
                        />
                        <span>{switchData.transfer}</span>
                      </div>
                    ),
                  ],
                  status: r?.financeReportStatus?.isSettle ? 'Transferred' : 'Hold',
                };
              })
            : []
        }
      />
    </div>
  );
}

('62bae844b2a0b049d97c4d7a');
// 626bbe244b8095f78a9b9b61
