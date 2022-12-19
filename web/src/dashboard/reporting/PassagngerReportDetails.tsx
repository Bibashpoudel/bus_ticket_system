

import React, { useEffect, useState } from 'react';
import GrdTable from '../../components/MDGridTable';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { useIntl } from 'react-intl';
import getSession from '../../apis/getSession';
import { phoneSubString } from '../../utils/utils';

const switchData = {
  year: <IntlMessages id={'year'} />,
  male: <IntlMessages id={'male'} />,
  female: <IntlMessages id={'female'} />,
  other: <IntlMessages id={'other'} />,
};

interface Data {
  [key: string]: any;
}

interface HeadCell {
  key: string;
  label: any;
}

const headCells: HeadCell[] = [
  { key: 'name', label: <IntlMessages id={'firstname'} /> },
  { key: 'last', label: <IntlMessages id={'lastname'} /> },
  { key: 'age', label: <IntlMessages id={'age'} /> },
  { key: 'phone_number', label: <IntlMessages id={'phoneNumberUA'} /> },
  { key: 'gender', label: <IntlMessages id={'gender'} /> },


  // { key: 'total_income', label: <IntlMessages id={'totalincome'} /> },
];

export default function PassagngerReportDetails(props: any) {
  const { data, loading, pageHandler } = props;
  const { locale } = useIntl();
  const [userInfo, setUserInfo] = useState({} as any);

  useEffect(() => {
    const userData = sessionStorage.getItem('user') || '';
    if (userData) {
      setUserInfo(JSON.parse(userData)?.user);
    }
  }, []);

  const calculateAgeDate = (dobValue: string) => {
    var today = new Date();
    var birthDate = new Date(dobValue);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;


  }



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
                name: `${r?.booking_id[0].firstname}`,

                last: `${r?.booking_id[0].lastname}`,
                age: (<span>{r?.booking_id[0].dob ? r?.booking_id[0].dob : ''} {r?.booking_id[0].dob ? switchData.year : ''}</span>),
                phone_number: (<span>{phoneSubString(r?.booking_id[0].phone)}</span>),
                gender: (<span>{r?.booking_id[0].gender ? r?.booking_id[0].gender == '1' ? switchData.male : r?.booking_id[0].gender == 2 ? switchData.female : r?.booking_id[0].gender == 3 ? switchData.other : '' : ''}</span>)


              };
            })
            : []
        }
      />
    </div>
  );
}
