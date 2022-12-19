import { Box, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import GrdTable from '../../components/MDGridTable';
import Link from 'next/link';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { useIntl } from 'react-intl';

// Language Switching data========
const switchData = {
  select: <IntlMessages id={'select'} />,
  filterName: <IntlMessages id={'filterbyname'} />,
  choose: <IntlMessages id={'choose'} />,
  search: <IntlMessages id={'search'} />,
  edit: <IntlMessages id={'edit'} />,
  delete: <IntlMessages id={'delete'} />,
  routes: <IntlMessages id={'routes'} />,
};

interface Data {
  [key: string]: any;
}

interface HeadCell {
  key: string;
  label: any;
}

const headCells: HeadCell[] = [
  { key: 'name', label: <IntlMessages id={'busname'} /> },
  { key: 'route', label: <IntlMessages id={'tableroute'} /> },
  { key: 'departure', label: <IntlMessages id={'departure'} /> },
  { key: 'arrival', label: <IntlMessages id={'arrival'} /> },
  { key: 'seat_available', label: <IntlMessages id={'seatavailable'} /> },
  { key: 'action', label: <IntlMessages id={'action'} /> },
];

export default function MDBookingManagement(props: any) {
  const { dataBusList, selectedDate, pageNoHandlerState } = props;
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
      {/* @ts-ignore */}
      <GrdTable
        headCells={headCells}
        pageNoHandler={(pageKey: any, pageValue: any) => pageNoHandlerState(pageKey, pageValue)}
        totalRecordCount={dataBusList?.totaldata}
        rows={
          dataBusList && dataBusList.data
            ? dataBusList.data.map((r: any) => {
              return {
                ...r,
                // name: r?.[locale]?.name,
                name:
                  userInfo.role === 'super-admin' || userInfo.role === 'admin'
                    ? `${r?.[locale]?.name}(${r?.[locale]?.bus_number})`
                    : `${r?.[locale]?.plate_number}(${r?.[locale]?.bus_number})`,

                departure: `${r.departure}`,
                arrival: `${r.arrival}`,
                route: `${r.route_id?.from?.[locale]?.location}-${r.route_id?.to?.[locale]?.location}`,
                seat_available: r.available_seat,
                action: [
                  <Link key={1} href={`/dashboard/book-now/${r._id}/${selectedDate}`}>
                    <Button key={1} variant="contained" color="primary" style={{ margin: 5 }}>
                      {switchData.select}
                    </Button>
                  </Link>,
                ],
              };
            })
            : []
        }
      />
    </div>
  );
}
