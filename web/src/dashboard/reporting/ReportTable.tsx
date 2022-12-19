import React, { useEffect, useState } from 'react';
import GrdTable from '../../components/MDGridTable';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { useIntl } from 'react-intl';
import getSession from '../../apis/getSession';

const switchData = {
  km: <IntlMessages id={'km'} />,
};

interface Data {
  [key: string]: any;
}

interface HeadCell {
  key: string;
  label: any;
}

const headCells: HeadCell[] = [
  { key: 'name', label: <IntlMessages id={'bus'} /> },
  { key: 'route', label: <IntlMessages id={'tableroute'} /> },
  { key: 'chassis', label: <IntlMessages id={'chassis'} /> },
  { key: 'motor_number', label: <IntlMessages id={'motorNumber'} /> },
  { key: 'total_travels', label: <IntlMessages id={'totaltravels'} /> },
  { key: 'total_tickets_sold', label: <IntlMessages id={'totalticketsold'} /> },
  { key: 'total_distance', label: <IntlMessages id={'totalDistance'} /> },
  // { key: 'total_income', label: <IntlMessages id={'totalincome'} /> },
];

export default function ReportTable(props: any) {
  const { data, loading, pageHandler } = props;
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
        headCells={headCells}
        pageNoHandler={pageHandler}
        totalRecordCount={data?.totaldata}
        loading={loading}
        rows={
          data?.data
            ? data.data.map((r: any) => {
              // console.log('Report ', r);
              return {
                ...r,
                // name: r?.[locale].bus_number,
                name:
                  userInfo.role === 'super-admin' || userInfo.role === 'admin'
                    ? `${r?.[locale].name}(${r?.[locale].bus_number})`
                    : `${r?.[locale].plate_number}(${r?.[locale].bus_number})`,

                departure: `${r.departure}`,
                arrival: `${r.arrival}`,
                route: `${r.route_id?.from?.[locale].location}-${r.route_id?.to?.[locale]?.location}`,
                chassis: `${r?.[locale].chasis ? r?.[locale].chasis : ''}`,
                motor_number: `${r?.[locale].motor_number ? r?.[locale].motor_number : ''}`,
                total_distance: (
                  <span>
                    {r?.total_distance} {switchData.km}
                  </span>
                ),

                action: [],
              };
            })
            : []
        }
      />
    </div>
  );
}
