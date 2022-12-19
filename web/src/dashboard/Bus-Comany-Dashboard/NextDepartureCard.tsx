import { Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { getDepartureList } from '../../apis/dashboard/busDashboard';

const switchData = {
  route: <IntlMessages id={'route'} />,
  email: <IntlMessages id={'email'} />,
  phone: <IntlMessages id={'phone'} />,
  name: <IntlMessages id={'name'} />,
  bus: <IntlMessages id={'bus'} />,
  time: <IntlMessages id={'time'} />,
};

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginBottom: 20,
  },
  pdiv: {
    width: '15%',
    [theme.breakpoints.down('sm')]: {
      width: '20%',
    },
  },
  pContainer: {
    marginBottom: 10,
    display: 'flex',
  },
}));
export default function NextDepartureCard() {
  const classes = useStyles();
  const { locale } = useIntl();
  const [userInfo, setUserInfo] = useState({} as any);

  useEffect(() => {
    const userData = sessionStorage.getItem('user') || '';
    if (userData) {
      setUserInfo(JSON.parse(userData)?.user);
    }
  }, []);

  const {
    data: departureDataList,
    refetch: refetchDepartureDataList,
    isPreviousData,
    isLoading: isLoadingAllClients,
    isSuccess,
  } = useQuery(['departureList'], getDepartureList);

  console.log('departure list', departureDataList);

  return (
    <div className={classes.wrapper}>
      {departureDataList &&
        departureDataList?.data?.slice(0, 3).map((obj: any, idx: number) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', marginBottom: 30 }}>
            <div className={classes.pContainer}>
              <p className={classes.pdiv}>{switchData.bus} :</p>
              <span>
                {/* {`${obj?.[locale]?.name}(${obj?.[locale]?.bus_number})`} */}
                {userInfo.role === 'super-admin' || userInfo === 'admin'
                  ? `${obj?.[locale]?.name}(${obj?.[locale]?.bus_number})`
                  : `${obj?.[locale]?.plate_number}(${obj?.[locale]?.bus_number})`}
              </span>
            </div>
            <div className={classes.pContainer}>
              <p className={classes.pdiv}>{switchData.route} :</p>
              <span> {`${obj?.route_id?.from?.[locale]?.location}-${obj?.route_id?.to?.[locale]?.location}`}</span>
            </div>
            <div className={classes.pContainer}>
              <p className={classes.pdiv}>{switchData.time} :</p>
              <span>{obj?.departure}</span>
            </div>
            <Divider />
          </div>
        ))}
    </div>
  );
}
