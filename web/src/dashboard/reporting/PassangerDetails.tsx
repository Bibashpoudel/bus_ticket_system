import { Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardDatePicker } from '@material-ui/pickers';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { getPassengerReportingList, getReportingList } from '../../apis/reporting/report';
import ReportTable from './ReportTable';
import { getRoute } from '../../apis/bus/route';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';
import { getBustList } from '../../apis/bus/buses';
import getSession from '../../apis/getSession';
import { getBusCompnayList } from '../../apis/bus/busCompany';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { useIntl } from 'react-intl';
import ReactToPrint from 'react-to-print';
import PassagngerReportDetails from './PassagngerReportDetails';

const switchData = {
  route: <IntlMessages id={'route'} />,
  upToDate: <IntlMessages id={'upToDate'} />,
  dateToDate: <IntlMessages id={'dateToDate'} />,
  to: <IntlMessages id={'to'} />,
  bus: <IntlMessages id={'bus'} />,
  periodOperating: <IntlMessages id={'periodOperating'} />,
  from: <IntlMessages id={'from'} />,
  busCompany: <IntlMessages id={'busCompany'} />,
  choose: <IntlMessages id={'choose'} />,
  timeScale: <IntlMessages id={'timeScale'} />,
  print: <IntlMessages id={'print'} />,

};

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    padding: 30,
    [theme.breakpoints.down('sm')]: {
      padding: 15,
    },
  },
  labelTextFieldContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 5,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: '20%',
    [theme.breakpoints.down('sm')]: {
      minWidth: '70%',
    },
  },
  periodOperatingContainer: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  pdiv: {
    width: '15%',
    [theme.breakpoints.down('sm')]: {
      width: '30%',
    },
  },
  pDivOperating: {
    width: '12%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginTop: 10,
    },
  },
  toFromWrapper: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  toFromContainer: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  datePicker: {
    marginRight: 15,
    width: '60%',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
  },
  pToFrom: {
    width: '20%',
  },
}));

export default function PassangerDetails() {
  const classes = useStyles();
  const [userInfo, setUserInfo] = useState({} as any);
  const [route_id, setRouteId] = useState('all');
  const [bus_number, setBusNumber] = useState('all');
  const [start_date, setStartDate] = useState('2022-01-01' as any);
  const [end_date, setEndDate] = useState(new Date() as any);
  const [time_scale, setTimeScale] = useState('up-to-date');
  const [busList, setBusList] = useState({} as any);
  const [routeList, setRouteList] = useState({} as any);
  const [status, updateStatus] = useState('');
  const [searchKey, updateSearchKey] = useState('');
  const [bus_company, updateBusCompany] = useState<any>('all');
  const { locale } = useIntl();
  const [pageInfo, updatePageInfo] = useState({ page: 1, size: 10 });
  // console.log('bus_company',bus_company);

  const {
    data: busCompanyList,
    refetch: busCompanyListRefetch,
    isPreviousData: busCompanyListPreviousData,
    isLoading: busCompanyListLoadingAllClients,
    isSuccess: isSuccessBusCompanyList,
  } = useQuery(['BusCompanyList', , status], getBusCompnayList, {
    enabled: userInfo.role === 'super-admin' || userInfo?.role === 'admin' || userInfo?.role === 'bus-company',
  });
  console.log('busCompanyList', busCompanyList);

  const [finalCompanyList, updatCompanyList] = useState([] as any);
  useEffect(() => {
    if (busCompanyList && busCompanyList.data) {
      let oldCompanyList = busCompanyList.data.slice();
      oldCompanyList.unshift({ _id: 'all', name: 'All' });
      updatCompanyList(oldCompanyList);
    }
  }, [isSuccessBusCompanyList, busCompanyList]);

  useEffect(() => {
    const userInfo = getSession();
    setUserInfo(userInfo);
  }, []);

  const updateRoute = (value: any) => {
    setRouteId(value);
    setBusNumber('all')
  };

  const updateBus = (key: string, value: any) => {
    setBusNumber(value);
  };

  const updateStartDate = (date: any) => {
    setStartDate(date);
  };

  const updateEndDate = (date: any) => {
    setEndDate(date);
  };

  const updateTimeScale = (value: any) => {
    setTimeScale(value);
    setStartDate(new Date());
    setEndDate(new Date());
  };

  const {
    data: reportList,
    refetch,
    isPreviousData,
    isLoading: isReportListLoading,
    isSuccess,
    remove,
  } = useQuery(
    ['report-list', route_id, bus_number, start_date, end_date, bus_company, pageInfo?.page, pageInfo?.size],
    getPassengerReportingList,
  );

  useEffect(() => {
    const userData = sessionStorage.getItem('user') || '';
    if (userData) {
      setUserInfo(JSON.parse(userData)?.user);
    }
  }, []);

  //getting buslist====
  const {
    data: dataBusList,
    refetch: fetchBusList,
    isPreviousData: isPreviousDataBusList,
    isLoading: isLoadingAllClients,
    isSuccess: isSuccessBusList,
  } = useQuery(['BusList', '', '', '', '', bus_company, route_id], getBustList);

  const [finalBusList, updatBusList] = useState([] as any);
  useEffect(() => {
    if (dataBusList && dataBusList.data) {
      let oldBusList = dataBusList.data.slice();
      oldBusList.unshift({ _id: 'all', name: 'All' });
      updatBusList(oldBusList);
    }
  }, [isSuccess, dataBusList]);

  // _, language, searchKey, page, size
  useEffect(() => {
    const busData = sessionStorage.getItem('bus') || '';
    if (busData) {
      setBusList(JSON.parse(busData)?.bus);
    }
  }, []);

  //getting routeList====

  const {
    data: getRouteData,
    refetch: fetchRouteList,
    isPreviousData: isPreviousDataRouteList,
    isLoading: isLoadingAllClientsRouteList,
    isSuccess: isGetRouteSuccess,
  } = useQuery(['RouteList', '', '', '', '', bus_company], getRoute);

  const [finalRouteList, updatRouteList] = useState([] as any);
  useEffect(() => {
    if (getRouteData && getRouteData.data) {
      let oldRouteList = getRouteData.data.slice();
      oldRouteList.unshift({ _id: 'all', name: 'All' });
      updatRouteList(oldRouteList);
    }
  }, [isSuccess, getRouteData]);

  // _, language, searchKey, page, size, company_id
  useEffect(() => {
    if (getRouteData && getRouteData.success) {
      const mapedRoutes = getRouteData.data.map((obj: any) => ({
        ...obj,
        name: `${obj.from[routeList.language]?.location} - ${obj.to[routeList.language]?.location}`,
        value: obj._id,
      }));
      setRouteList(mapedRoutes);
    }
  }, [isGetRouteSuccess, getRouteData]);

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
  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef<(() => void) | null>(null);

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
      <Button variant="contained" color="primary"> {switchData.print}</Button>

    );
  }, []);

  return (
    <Paper className={classes.paperContainer}>
      {userInfo && userInfo.role === 'super-admin' && (
        <div className={classes.labelTextFieldContainer} style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <p className={classes.pdiv}>{switchData.busCompany} :</p>
          <FormControl size="small" variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-customized-select-label">
              <p>- {switchData.choose} -</p>
            </InputLabel>
            <Select
              labelId="demo-customized-select-label"
              id="demo-customized-select"
              value={bus_company}
              variant="outlined"
              label="- choose -"
              onChange={(e) => updateBusCompany(e.target.value)}>
              {busCompanyList && busCompanyList.data
                ? finalCompanyList.map((obj: any, idx: number) => (
                  <MenuItem key={idx} value={obj?._id}>
                    {obj.name || obj?.[locale]?.bus_legal_name}
                  </MenuItem>
                ))
                : []}
            </Select>
          </FormControl>
        </div>
      )}
      <div className={classes.labelTextFieldContainer}>
        <p className={classes.pdiv}>{switchData.route} :</p>
        <FormControl size="small" variant="outlined" className={classes.formControl}>
          <InputLabel id="demo-customized-select-label">
            <p>- {switchData.choose} -</p>
          </InputLabel>
          <Select
            labelId="demo-customized-select-label"
            id="demo-customized-select"
            value={route_id}
            variant="outlined"
            label="- choose -"
            onChange={(e) => updateRoute(e.target.value)}>
            {getRouteData && getRouteData.data
              ? finalRouteList.map((obj: any, idx: number) => (
                <MenuItem key={idx} value={obj._id}>
                  {obj.name || `${obj?.from?.english?.location} - ${obj?.to?.english?.location}`}
                </MenuItem>
              ))
              : []}
          </Select>
        </FormControl>
      </div>
      <div className={classes.labelTextFieldContainer}>
        <p className={classes.pdiv}>{switchData.bus} :</p>
        <FormControl size="small" variant="outlined" className={classes.formControl}>
          <InputLabel id="demo-customized-select-label">
            <p>- {switchData.choose} -</p>
          </InputLabel>
          <Select
            labelId="demo-customized-select-label"
            id="obj.id"
            value={bus_number}
            variant="outlined"
            label="- choose -"
            onChange={(e) => updateBus('bus_number', e.target.value)}>
            {dataBusList && dataBusList.data
              ? finalBusList.map((obj: any) => (
                <MenuItem key={obj.id} value={obj?._id}>
                  {userInfo?.role === 'super-admin' || userInfo?.role === 'admin'
                    ? obj.name || `${obj?.[locale]?.name}(${obj?.[locale]?.bus_number})`
                    : obj.name || `${obj?.[locale]?.plate_number}(${obj?.[locale].bus_number})`}
                </MenuItem>
              ))
              : []}
          </Select>
        </FormControl>
      </div>
      <div className={classes.labelTextFieldContainer}>
        <p className={classes.pdiv}>{switchData.timeScale} :</p>
        <FormControl size="small" variant="outlined" className={classes.formControl}>
          <InputLabel id="demo-customized-select-label">
            <p>- {switchData.choose} -</p>
          </InputLabel>
          <Select
            labelId="demo-customized-select-label"
            id="demo-customized-select"
            value={time_scale}
            variant="outlined"
            label="- choose -"
            onChange={(e) => updateTimeScale(e.target.value)}>
            <MenuItem value={'up-to-date'}>{switchData.upToDate} </MenuItem>
            <MenuItem value={'date-to-date'}>{switchData.dateToDate}</MenuItem>
          </Select>
        </FormControl>
      </div>

      {time_scale === 'date-to-date' && (
        <div className={classes.periodOperatingContainer}>
          <p className={classes.pDivOperating}>Period Operating :</p>
          <div className={classes.toFromWrapper}>
            <div className={classes.toFromContainer}>
              <p className={classes.pToFrom}>{switchData.from}: </p>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="DD/MM/YYYY"
                margin="normal"
                id="date-picker-inline"
                value={start_date || new Date()}
                onChange={updateStartDate}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                className={classes.datePicker}
              />
            </div>
            <div className={classes.toFromContainer}>
              <p className={classes.pToFrom}>{switchData.to} : </p>
              <KeyboardDatePicker
                onChange={updateEndDate}
                disableToolbar
                variant="inline"
                format="DD/MM/YYYY"
                margin="normal"
                id="date-picker-inline"
                value={end_date || new Date()}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                className={classes.datePicker}
              />
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
        <PassagngerReportDetails data={reportList} loading={isReportListLoading} pageHandler={pageNoHandler} />

      </div>

      <NotificationLoader loading={isReportListLoading} message={''} error={''} />
    </Paper>
  );
}
